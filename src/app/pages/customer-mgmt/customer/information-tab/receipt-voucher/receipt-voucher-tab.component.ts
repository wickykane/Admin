import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { cdArrowTable } from '../../../../../shared';
import { Helper } from '../../../../../shared/helper/common.helper';
import { CustomerService } from '../../../customer.service';
import { CustomerKeyViewService } from '../../view/keys.view.control';
import { TableService } from './../../../../../services/table.service';

import { ReceiptVoucherService } from '../../../../financial/receipt-voucher/receipt-voucher.service';

@Component({
    selector: 'app-customer-receipt-voucher-tab',
    templateUrl: './receipt-voucher-tab.component.html',
    styleUrls: ['../information-tab.component.scss'],
    providers: [HotkeysService, CustomerKeyViewService, ReceiptVoucherService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerReceiptVoucherTabComponent implements OnInit, OnDestroy {

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
        private customerService: CustomerService,
        public tableService: TableService,
        public _hotkeysServiceReceipt: HotkeysService,
        private helper: Helper,
        private receiptVoucherService: ReceiptVoucherService,
        private cd: ChangeDetectorRef) {

        this.searchForm = fb.group({
            'receipt_no': [null],
            'payment_method': [null],
            'customer_id': [null],
            'electronic': [null],
            'status': [null],
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
        this.listMaster['dateType'] = [
            { id: 'payment_date', name: 'Payment Date' },
            { id: 'created_at', name: 'Created On' },
            { id: 'updated_at', name: 'Updated On' }
        ];
        this.listMaster['electType'] = [
            { id: 0, name: 'No' },
            { id: 1, name: 'Yes' }
        ];
        this.getListStatus();
        this.getListReferenceData();
        this.getList();
    }
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

        this.customerService.getListPayment(this._customerId, params).subscribe(res => {
            try {
                this.list.items = res.data.rows || [];
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    getListStatus() {
        this.receiptVoucherService.countVoucherStatus().subscribe(res => {
            this.listMaster['list-status'] = res.data;
            this.refresh();
        });
    }

    getListReferenceData() {
        this.receiptVoucherService.getPaymentMethodOption().subscribe(res => {
            this.listMaster['paymentMethod'] = res.data.payment_method;
            this.refresh();
        });
    }

    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td a').focus();
        this.refresh();
    }

    initKeyBoard() {
        this.data['key_config'] = {
            receipt_no: {
                element: null,
                focus: true,
            },
        };

        this._hotkeysServiceReceipt.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            if (this.data['key_config'].receipt_no.element) {
                this.data['key_config'].receipt_no.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus'));

        this._hotkeysServiceReceipt.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.tableService.searchAction();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));
        this._hotkeysServiceReceipt.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
            (document.activeElement as HTMLInputElement).blur();
            event.preventDefault();
            this.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));
        this._hotkeysServiceReceipt.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.tableService.resetAction(this.searchForm);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));
        this._hotkeysServiceReceipt.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+u', (event: KeyboardEvent): boolean => {
            this.tableService.pagination.page--;
            if (this.tableService.pagination.page < 1) {
                this.tableService.pagination.page = 1;
                return;
            }
            this.tableService.changePage(this.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Previous page'));

        this._hotkeysServiceReceipt.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+y', (event: KeyboardEvent): boolean => {
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
        const keys = Array.from(this._hotkeysServiceReceipt.hotkeys);
        keys.map(key => {
            this._hotkeysServiceReceipt.remove(key);
        });
    }

    ngOnDestroy() {
       this.resetKeys();
    }
}
