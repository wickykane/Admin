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
    selector: 'app-customer-sale-order-tab',
    templateUrl: './sale-order-tab.component.html',
    styleUrls: ['../information-tab.component.scss'],
    providers: [OrderService, HotkeysService, CustomerKeyViewService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerSaleOrderTabComponent implements OnInit, OnDestroy {

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

    public list = {
        items: []
    };

    searchForm: FormGroup;
    public data = {};
    public selectedIndex = 0;
    @ViewChild(cdArrowTable) table: cdArrowTable;
    constructor(
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        private customerService: CustomerService,
        public _hotkeysServiceSaleOder: HotkeysService,
        private jwtService: JwtService,
        private helper: Helper,
        private orderService: OrderService, private cd: ChangeDetectorRef) {

        this.searchForm = fb.group({
            'code': [null],
            'cus_po': [null],
            'quote_no': [null],
            'type': [null],
            'sts': [null],
            'buyer_name': [null],
            'date_type': [null],
            'date_to': [null],
            'date_from': [null],
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;

    }

    ngOnInit() {
        this.listMaster['dateType'] = [{ id: 'order_dt', name: 'Order Date' }, { id: 'delivery_dt', name: 'Delivery Date' }];
        this.listMaster['type'] = [{ id: 'PKU', name: 'Pickup ' }, { id: 'NO', name: 'Regular Order' }, { id: 'ONL', name: 'Ecommerce' }, { id: 'XD', name: 'X-Docks' }];
        this.getListStatus();
        this.initKeyBoard();
    }

    /**
     * Internal Function
     */
    selectData(index) {
        console.log(index);
    }
    refresh() {
        if (!this.cd['destroyed']) { this.cd.detectChanges(); }
   }

    getListStatus() {
        this.orderService.getListStatus().subscribe(res => {
            this.listMaster['status'] = res.data;
            this.refresh();
        });
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

        params.order = 'id';
        params.sort = 'desc';

        this.customerService.getListSO(this._customerId, params).subscribe(res => {
            try {
                this.list.items = res.data.rows || [];
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    exportData() {
        const anchor = document.createElement('a');
        const path = 'buyer/export-order/';
        const file = `${environment.api_url}${path}${this._customerId}`;
        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.jwtService.getToken());
        fetch(file, { headers })
            .then(response => response.blob())
            .then(blobby => {
                const objectUrl = window.URL.createObjectURL(blobby);
            anchor.href = objectUrl;
            anchor.download = 'sale_orders.xls';
            anchor.click();
            window.URL.revokeObjectURL(objectUrl);
        });
    }
    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td').focus();
    }
    initKeyBoard() {
        this.data['key_config'] = {
            code: {
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

        this._hotkeysServiceSaleOder.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            if (this.data['key_config'].code.element) {
                this.data['key_config'].code.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus'));

        this._hotkeysServiceSaleOder.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.tableService.searchAction();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));

        this._hotkeysServiceSaleOder.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.tableService.resetAction(this.searchForm);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));

        this._hotkeysServiceSaleOder.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+x', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.exportData();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Export'));

        this._hotkeysServiceSaleOder.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));

        this._hotkeysServiceSaleOder.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+u', (event: KeyboardEvent): boolean => {
            this.tableService.pagination.page--;
            if (this.tableService.pagination.page < 1) {
                this.tableService.pagination.page = 1;
                return;
            }
            this.tableService.changePage(this.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Previous page'));

        this._hotkeysServiceSaleOder.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+y', (event: KeyboardEvent): boolean => {
            this.tableService.pagination.page++;
            if (this.tableService.pagination.page > this.tableService.pagination.total_page) {
                this.tableService.pagination.page = this.tableService.pagination.total_page;
                return;
            }
            console.log(this.tableService.pagination.page);
            this.tableService.changePage(this.tableService.pagination.page);
            console.log(this.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Next page'));
    }
    resetKeys() {
        const keys = Array.from(this._hotkeysServiceSaleOder.hotkeys);
        keys.map(key => {
            this._hotkeysServiceSaleOder.remove(key);
        });
    }

    ngOnDestroy() {
         this.resetKeys();
    }

}
