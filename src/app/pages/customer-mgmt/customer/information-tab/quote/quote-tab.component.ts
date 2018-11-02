import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { environment } from '../../../../../../environments/environment';
import { cdArrowTable, JwtService } from '../../../../../shared';
import { Helper } from '../../../../../shared/helper/common.helper';
import { OrderService } from '../../../../order-mgmt/order-mgmt.service';
import { CustomerService } from '../../../customer.service';
import { CustomerKeyViewService } from '../../view/keys.view.control';
import { TableService } from './../../../../../services/table.service';

@Component({
    selector: 'app-customer-quote-tab',
    templateUrl: './quote-tab.component.html',
    styleUrls: ['../information-tab.component.scss'],
    providers: [HotkeysService, CustomerKeyViewService, OrderService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerQuoteTabComponent implements OnInit, OnDestroy {

    /**
     * letiable Declaration
     */

    public _customerId;
    @Input() set customerId(id) {
        if (id) {
            this._customerId = id;
            this.getList();
        }
    }

    public listMaster = {};
    public data = {};
    public list = {
        items: []
    };
    public selectedIndex = 0;
    searchForm: FormGroup;
    @ViewChild(cdArrowTable) table: cdArrowTable;
    constructor(
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        private orderService: OrderService,
        public _hotkeysServiceQuote: HotkeysService,
        private jwtService: JwtService,
        private helper: Helper,
        private customerService: CustomerService, private cd: ChangeDetectorRef) {

        this.searchForm = fb.group({
            'quote_no': [null],
            'buyer_name': [null],
            'sts': [null],
            'date_type': [null],
            'date_from': [null],
            'date_to': [null]
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        this.initKeyBoard();
    }

    ngOnInit() {
        this.listMaster['listFilter'] = [{ value: false, name: 'Date Filter' }];
        this.listMaster['dateType'] = [{ id: 'quote_dt', name: 'Quote Date' }, { id: 'expiry_dt', name: 'Expiry Date' }, { id: 'delivery_dt', name: 'Delivery Date' }];
        this.getListStatus();
    }

    /**
     * Internal Function
     */
    getListStatus() {
        this.orderService.getListSaleQuotationStatus().subscribe(res => {
            try {
                this.listMaster['listStatus'] = res.data;
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }
    selectData(index) {
        console.log(index);
    }
     refresh() {
          if (!this.cd['destroyed']) { this.cd.detectChanges(); }
     }
     getList() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value, ...this.listMaster['filter'] || {} };

        Object.keys(params).forEach((key) => {
            if (params[key] instanceof Array) {
                params[key] = params[key].join(',');
            }
            // tslint:disable-next-line:no-unused-expression
            (params[key] === null || params[key] === '') && delete params[key];
        });
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

        this.customerService.getListQuote(this._customerId, params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    exportData() {
        const anchor = document.createElement('a');
        const path = 'buyer/export-quote/';
        const file = `${environment.api_url}${path}${this._customerId}`;
        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.jwtService.getToken());
        fetch(file, { headers })
            .then(response => response.blob())
            .then(blobby => {
                const objectUrl = window.URL.createObjectURL(blobby);
            anchor.href = objectUrl;
            anchor.download = 'quotes.xls';
            anchor.click();
        window.URL.revokeObjectURL(objectUrl);
         });
    }

    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td a').focus();
    }
    initKeyBoard() {
        this.data['key_config'] = {
            quote_no: {
                element: null,
                focus: true,
            },
        };
        // saveKeys() {
        //     this.keys = this.getKeys();
        //     this.context.data['tableKey'] = this.context.table.getKeys();
        //     this.resetKeys();
        //     this.context.table.resetKeys();
        // }

        this._hotkeysServiceQuote.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            if (this.data['key_config'].quote_no.element) {
                this.data['key_config'].quote_no.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus'));

        this._hotkeysServiceQuote.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.tableService.searchAction();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));
         this._hotkeysServiceQuote.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));
        this._hotkeysServiceQuote.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.tableService.resetAction(this.searchForm);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));
        this._hotkeysServiceQuote.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+x', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.exportData();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Export'));

        this._hotkeysServiceQuote.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+u', (event: KeyboardEvent): boolean => {
            this.tableService.pagination.page--;
            if (this.tableService.pagination.page < 1) {
                this.tableService.pagination.page = 1;
                return;
            }
            this.tableService.changePage(this.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Previous page'));

        this._hotkeysServiceQuote.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+y', (event: KeyboardEvent): boolean => {
            this.tableService.pagination.page++;
            if (this.tableService.pagination.page > this.tableService.pagination.total_page) {
                this.tableService.pagination.page = this.tableService.pagination.total_page;
                return;
            }
            this.tableService.changePage(this.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Next page'));
    }
    resetKeys() {
        const keys = Array.from(this._hotkeysServiceQuote.hotkeys);
        keys.map(key => {
            this._hotkeysServiceQuote.remove(key);
        });
    }

    ngOnDestroy() {
       this.resetKeys();
    }

}
