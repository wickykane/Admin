import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { environment } from '../../../../../../environments/environment';
import { cdArrowTable, JwtService } from '../../../../../shared';
import { Helper } from '../../../../../shared/helper/common.helper';
import { FinancialService } from '../../../../financial/financial.service';
import { CustomerService } from '../../../customer.service';
import { CustomerKeyViewService } from '../../view/keys.view.control';
import { TableService } from './../../../../../services/table.service';

@Component({
    selector: 'app-customer-invoice-tab',
    templateUrl: './invoice-tab.component.html',
    styleUrls: ['../information-tab.component.scss'],
    providers: [HotkeysService, CustomerKeyViewService, HotkeysService, FinancialService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerInvoiceTabComponent implements OnInit, OnDestroy {

    /**
     * letiable Declaration
     */
    public data = {};
    public dateType;
    public _customerId;
    @Input() set customerId(id) {
        if (id) {
            this._customerId = id;
            this.getList();
        }
    }

    public listMaster = {};
    public selectedIndex = 0;
    public list = {
        items: []
    };

    searchForm: FormGroup;
    public statusConfig = {
        'New': { color: 'blue', name: 'New', id: 1, img: './assets/images/icon/new.png' },
        'Submitted': { color: 'texas-rose', name: 'Submited', id: 2 },
        // 'Rejected': { color: 'magenta', name: 'Rejected', id: 3 },
        'Approved': { color: 'strong-green', name: 'Approved', id: 4, img: './assets/images/icon/approved.png' },
        'Partially Paid': { color: 'darkblue', name: 'Partially Paid', id: 5, img: './assets/images/icon/partial_delivered.png' },
        'Fully Paid': { color: 'lemon', name: 'Fully Paid', id: 6, img: './assets/images/icon/full_delivered.png' },
        'Canceled': { color: 'red', name: 'Canceled', id: 7, img: './assets/images/icon/cancel.png' },
        'Overdue': { color: 'bright-grey', name: 'Overdue', id: 8 },
        'Revised': { color: 'texas-rose', name: 'Revised', id: 11 },
    };
    @ViewChild(cdArrowTable) table: cdArrowTable;
    // @ViewChild('tabSet') tabSet;
    constructor(
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        public keyService: CustomerKeyViewService,
        private financialService: FinancialService,
        private customerService: CustomerService,
        public _hotkeysServiceInvoice: HotkeysService,
        private jwtService: JwtService,
        private helper: Helper,
        private cd: ChangeDetectorRef) {

        this.searchForm = fb.group({
            'inv_num': [null],
            'cus_name': [null],
            'order_num': [null],
            'sku': [null],
            'status': [null],
            'inv_type': [null],
            'inv_dt_from': [null],
            'inv_dt_to': [null],
            'inv_due_dt_from': [null],
            'inv_due_dt_to': [null]
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        this.initKeyBoard();
    }

    ngOnInit() {
    this.listMaster['listFilter'] = [{ value: false, name: 'Date Filter' }];
    this.listMaster['dateType'] = [{ id: 0, name: 'Invoice Date' }, { id: 1, name: 'Due Date' }];
    this.listMaster['inv_type'] = [
        { id: 1, name: 'Sales Order' }
    ];
    this.getCountStatus();
    this.getListStatus();
    }
    getListStatus() {
        this.financialService.getInvoiceStatus().subscribe(res => {
            this.listMaster['status'] = res.data.status;
            this.refresh();
        });
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
     onDateTypeChanged() {
        this.searchForm.patchValue({
            'inv_dt_from': null,
            'inv_dt_to': null,
            'inv_due_dt_from': null,
            'inv_due_dt_to': null
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

        this.customerService.getListInvoice(this._customerId, params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    getCountStatus() {
        this.financialService.countInvoiceStatus().subscribe(res => {
            res.data.map(item => {
                if (this.statusConfig[item.name]) {
                    this.statusConfig[item.name].count = item.count;
                    this.statusConfig[item.name].status = this.statusConfig[item.name].id;
                }
            });
            this.listMaster['count-status'] = Object.keys(this.statusConfig).map(key => {
                return this.statusConfig[key];
            });
            this.refresh();
        });
    }
    convertStatus(id, key) {
        const stt = (this.listMaster[key] || []).find(item => item.id === id) || {};
        return stt.name;
    }

    exportData() {
        const anchor = document.createElement('a');
        const path = 'buyer/export-invoice/';
        const file = `${environment.api_url}${path}${this._customerId}`;
        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.jwtService.getToken());
        fetch(file, { headers })
            .then(response => response.blob())
            .then(blobby => {
                const objectUrl = window.URL.createObjectURL(blobby);
            anchor.href = objectUrl;
            anchor.download = 'invoices.xls';
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
            inv_num: {
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
        this._hotkeysServiceInvoice.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            if (this.data['key_config'].inv_num.element) {
                this.data['key_config'].inv_num.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus'));

        this._hotkeysServiceInvoice.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.tableService.searchAction();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));

        this._hotkeysServiceInvoice.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.tableService.resetAction(this.searchForm);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));
        this._hotkeysServiceInvoice.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+x', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.exportData();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Export'));
        this._hotkeysServiceInvoice.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));
        this._hotkeysServiceInvoice.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+u', (event: KeyboardEvent): boolean => {
            this.tableService.pagination.page--;
            if (this.tableService.pagination.page < 1) {
                this.tableService.pagination.page = 1;
                return;
            }
            this.tableService.changePage(this.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Previous page'));

        this._hotkeysServiceInvoice.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+y', (event: KeyboardEvent): boolean => {
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
        const keys = Array.from(this._hotkeysServiceInvoice.hotkeys);
        keys.map(key => {
            this._hotkeysServiceInvoice.remove(key);
        });
    }

    ngOnDestroy() {
       this.resetKeys();
    }
}
