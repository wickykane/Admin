import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { cdArrowTable } from '../../../../shared';
import { Helper } from '../../../../shared/helper/common.helper';
import { CustomerService } from '../../customer.service';
import { CustomerKeyViewService } from '../keys.view.control';
import { TableService } from './../../../../services/table.service';

@Component({
    selector: 'app-customer-payment-tab',
    templateUrl: './payment-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
    providers: [HotkeysService, CustomerKeyViewService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerPaymentTabComponent implements OnInit, OnDestroy {

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
        public _hotkeysServicePayment: HotkeysService,
        private helper: Helper,
        private customerService: CustomerService, private cd: ChangeDetectorRef) {

        this.searchForm = fb.group({
            'buyer_name': [null],
            'email': [null],
            'buyer_type': [null],
            'from': [null],
            'to': [null]
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        this.initKeyBoard();
    }

    ngOnInit() {}
    selectData(index) {
        console.log(index);
    }
    /**
     * Internal Function
     */
     refresh() {
          if (!this.cd['destroyed']) { this.cd.detectChanges(); }
     }

    getList() {
        const params = {...this.tableService.getParams(), ...this.searchForm.value};
        Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

        this.customerService.getListInvoice(this._customerId, params).subscribe(res => {
            try {
                this.list.items = [] || res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }
    initKeyBoard() {
        this.data['key_config'] = {
            buyer_name: {
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
        // this._hotkeysServicePayment.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
        //     event.preventDefault();
        //     this.selectTable();
        //     return;
        // }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));

        this._hotkeysServicePayment.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            if (this.data['key_config'].buyer_name.element) {
                this.data['key_config'].buyer_name.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus'));

        this._hotkeysServicePayment.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.tableService.searchAction();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));

        this._hotkeysServicePayment.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.tableService.resetAction(this.searchForm);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));
        this._hotkeysServicePayment.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+left', (event: KeyboardEvent): boolean => {
            this.tableService.pagination.page--;
            if (this.tableService.pagination.page < 1) {
                this.tableService.pagination.page = 1;
                return;
            }
            this.tableService.changePage(this.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Previous page'));

        this._hotkeysServicePayment.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+right', (event: KeyboardEvent): boolean => {
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
        const keys = Array.from(this._hotkeysServicePayment.hotkeys);
        keys.map(key => {
            this._hotkeysServicePayment.remove(key);
        });
    }

    ngOnDestroy() {
       this.resetKeys();
    }

}
