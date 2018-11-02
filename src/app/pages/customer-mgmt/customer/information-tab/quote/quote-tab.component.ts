import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { cdArrowTable } from '../../../../../shared';
import { Helper } from '../../../../../shared/helper/common.helper';
import { CustomerService } from '../../../customer.service';
import { CustomerKeyViewService } from '../../view/keys.view.control';
import { TableService } from './../../../../../services/table.service';

@Component({
    selector: 'app-customer-quote-tab',
    templateUrl: './quote-tab.component.html',
    styleUrls: ['../information-tab.component.scss'],
    providers: [HotkeysService, CustomerKeyViewService],
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
        public _hotkeysServiceQuote: HotkeysService,
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

    ngOnInit() { }

    /**
     * Internal Function
     */
    selectData(index) {
        console.log(index);
    }
     refresh() {
          if (!this.cd['destroyed']) { this.cd.detectChanges(); }
     }

    getList() {
        const params = {...this.tableService.getParams(), ...this.searchForm.value};
        Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

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
        this._hotkeysServiceQuote.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+u', (event: KeyboardEvent): boolean => {
            this.tableService.pagination.page--;
            if (this.tableService.pagination.page < 1) {
                this.tableService.pagination.page = 1;
                return;
            }
            this.tableService.changePage(this.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Previous page'));

        this._hotkeysServiceQuote.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+d', (event: KeyboardEvent): boolean => {
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
