import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { cdArrowTable } from '../../../../shared';
import { Helper } from '../../../../shared/helper/common.helper';
import { CustomerService } from '../../customer.service';
import { CustomerKeyViewService } from '../keys.view.control';
import { TableService } from './../../../../services/table.service';

@Component({
    selector: 'app-customer-invoice-tab',
    templateUrl: './invoice-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
    providers: [HotkeysService, CustomerKeyViewService, HotkeysService],
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
    @ViewChild(cdArrowTable) table: cdArrowTable;
    @ViewChild('tabSet') tabSet;
    constructor(
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        public keyService: CustomerKeyViewService,
        private customerService: CustomerService,
        public _hotkeysServiceInvoice: HotkeysService,
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
    this.listMaster['dateType'] = [{ id: 0, name: 'Invoice Date' }, { id: 1, name: 'Due Date' }];
    this.getList();
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
    // selectTable() {
    //     this.selectedIndex = 0;
    //     this.table.element.nativeElement.querySelector('td').focus();
    // }
    getList() {
        const params = {...this.tableService.getParams(), ...this.searchForm.value};
        Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

        this.customerService.getListInvoice(this._customerId, params).subscribe(res => {
            try {
                if (this.keyService.keys.length > 0) {
                    this.keyService.reInitKey();
                    this.table.reInitKey(this.data['tableKey']);
                }
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        }, dismiss => {
            if (this.keyService.keys.length > 0) {
                this.keyService.reInitKey();
                this.table.reInitKey(this.data['tableKey']);
            }
         });
        this.refresh();
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

        this._hotkeysServiceInvoice.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+d', (event: KeyboardEvent): boolean => {
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
