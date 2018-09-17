import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';

import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/Subject';
import { routerTransition } from '../../../../router.animations';

import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { NgbDateCustomParserFormatter } from '../../../../shared/helper/dateformat';
import { ItemModalContent } from '../../../../shared/modals/item.modal';
import { OrderHistoryModalContent } from '../../../../shared/modals/order-history.modal';
import { PromotionModalContent } from '../../../../shared/modals/promotion.modal';
import { ItemMiscModalContent } from './../../../../shared/modals/item-misc.modal';
import { InvoiceCreateKeyService } from './keys.create.control';

import { HotkeysService } from 'angular2-hotkeys';
import * as _ from 'lodash';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';
import { ReceiptVoucherService } from './../receipt-voucher.service';

@Component({
    selector: 'app-create-receipt-voucher',
    templateUrl: './receipt-voucher.create.component.html',
    styleUrls: ['../receipt-voucher.component.scss'],
    providers: [OrderService, ReceiptVoucherService, HotkeysService, InvoiceCreateKeyService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
    animations: [routerTransition()]
})

export class ReceiptVoucherCreateComponent implements OnInit {
    /**
     * Variable Declaration
     */

    public generalForm: FormGroup;
    public listMaster = {};
    public selectedIndex = 0;
    public data = {};

    public messageConfig = {
        '2': 'Are you sure that you want to submit this receipt voucher?',
        '4': 'Are you sure that you want to Save & Validate this receipt voucher?',
        'error': 'This Receipt Voucher is missing some mandatory fields, please fulfill them before submitting.',
        'overpayment': 'There is overpayment in this receipt voucher. Are you sure that you want to submit it?',
        'overpayment-approve': 'There is overpayment in this receipt voucher. After approval, the system will create automatically the credit memo for the overpayment. Do you want to proceed?',
        'default': 'The data you have entered may not be saved, are you sure that you want to leave?',
    };

    public list: any = {
        items: [],
        checklist: []
    };

    public searchKey = new Subject<any>(); // Lazy load filter
    public checkAllItem;

    /**
     * Init Data
     */
    constructor(
        private vRef: ViewContainerRef,
        private fb: FormBuilder,
        public toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private orderService: OrderService,
        private _hotkeysService: HotkeysService,
        public keyService: InvoiceCreateKeyService,
        private voucherService: ReceiptVoucherService,
        private dt: DatePipe) {
        this.generalForm = fb.group({
            'approver_id': [null, Validators.required],
            'payer_id': [null, Validators.required],
            'warehouse_id': [null],
            'payment_method_id': [null, Validators.required],
            'note': [null],
            'is_electronic': [null, Validators.required],
            'amount_received': [null, Validators.required],
            'payment_dt': [null, Validators.required],
            'voucher_no': [null, Validators.required],
            'updated_by': [null],
            'updated_date': [null],
            'created_by': [null],
            'parent_id': [null, Validators.required],
            'check_no': [null, Validators.required],
            'ref_no': [null, Validators.required],
            'remain_amt': [null, Validators.required]
        });
        //  Init Key
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    async ngOnInit() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const currentDt = new Date();

        // List Master
        this.getListReference();
        await this.getListPaymentMethod();
        this.getGenerateCode();

        this.generalForm.patchValue({
            approver_id: user.id,
            updated_by: user.full_name,
            created_by: user.full_name,
            updated_date: currentDt.toISOString().slice(0, 10),
            payment_dt: currentDt.toISOString().slice(0, 10)
        });

        // Lazy Load filter
        this.data['page'] = 1;
        const params = { page: this.data['page'], length: 15 };
        this.orderService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = res.data.rows;
            this.data['total_page'] = res.data.total_page;
        });
        this.searchKey.subscribe(key => {
            this.data['page'] = 1;
            this.searchCustomer(key);
        });

        // Init Change Event
        this.onChangePaymentMethod();
        this.onChangeWareHouse();
    }

    /**
     * Mater Data
     */

    getListReference() {
        this.listMaster['yes_no_options'] = [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }];
        this.orderService.getOrderReference().subscribe(res => {
            Object.assign(this.listMaster, res.data);
        });
    }

    getListInvoiceAndMemo() {
        const params = {
            inv_no: this.data['search'],
            warehouse_id: this.generalForm.value.warehouse_id,
        };
        Object.keys(params).forEach(key => {
            if (!params[key]) {
                delete params[key];
            }
        });
        this.voucherService.getListInvoiceAndMemo(params).subscribe(res => {
            this.list.items = [{}] || res.data;
            this.updateTotal();
        });
    }

    resetChangeData() {
    }

    getListPaymentMethod() {
        return new Promise(resolve => {
            this.voucherService.getPaymentMethod().subscribe(res => {
                this.listMaster['payment_method'] = res.data;
                resolve(true);
            });
        });
    }

    getGenerateCode() {
        this.voucherService.getGenerateCode().subscribe(res => {
            this.generalForm.get('voucher_no').patchValue(res.data.code);
        });
    }

    /**
     * Internal Function
     */
    // Table event
    selectData(index) {
        console.log(index);
    }

    checkAll(ev) {
        this.list.items.forEach(x => x.is_checked = ev.target.checked);
        this.list.checklist = this.list.items.filter(item => item.is_checked);
    }

    isAllChecked() {
        this.checkAllItem = this.list.items.every(item => item.is_checked);
        this.list.checklist = this.list.items.filter(item => item.is_checked);
    }

    onChangePaymentMethod() {
        this.generalForm.get('payment_method_id').valueChanges.subscribe(id => {
            const payment = this.listMaster['payment_method'].find(item => +item.id === +id);
            this.data['payment'] = payment || {};
        });
    }

    onChangeWareHouse() {
        this.generalForm.get('warehouse_id').valueChanges.subscribe(id => {
            if (!id) {
                return;
            }
            this.data['search'] = null;
            this.getListInvoiceAndMemo();
        });
    }

    clearPayment() {
        this.data['search'] = null;
        // this.getListInvoiceAndMemo();
        const checkedList = this.list.checklist.map(item => item.id);
        this.list.items.forEach(item => {
            if (checkedList.length > 0 && checkedList.indexOf(item.id) !== 1) {
                item.applied_amt = 0;
            }
        });
    }

    updateTotal(_item?) {
        if (_item) {
            // let total = 0;
            // this.list.items.filter(it => it.id !== _item.id).map(j => {
            //     total += (+j.applied_amt || 0);
            // });
            // const remain = this.generalForm.value.amount_received - total;
            // _item.applied_amt = (_item.applied_amt > remain) ? remain : _item.applied_amt;
            // this.list.items[this.list.items.indexOf(_item)].applied_amt = _item.applied_amt.applied_amt;
            // return this.updateTotal();
        }

        this.data['summary'] = {
            total: 0,
        };

        this.list.items.map(item => {
            this.data['summary'].total += (+item.applied_amt || 0);
        });

        this.data['summary'].change = this.generalForm.value.amount_received - this.data['summary'].total;

    }

    resetVoucher() {
        this.generalForm.reset();
        this.data = {};
        this.list = {
            items: [],
            checklist: []
        };

        this.searchKey = new Subject<any>();
        this.checkAllItem = null;
        this.ngOnInit();
    }

    createVoucher(type, is_draft?, is_continue?) {
        if (!is_draft && this.generalForm.invalid) {
            this.data['showError'] = true;
            this.toastr.error(this.messageConfig.error);
            return;
        } else {
            this.data['showError'] = true;
        }

        const items = this.list.items.map(item => {
            item.is_item = (item.misc_id) ? 0 : 1;
            item.order_detail_id = item.id;
            return item;
        });

        const params = {
            ...this.generalForm.value,
        };

        this.voucherService.createVoucher(params).subscribe(res => {
            try {
                if (res.status) {
                    this.toastr.success(res.message);
                    this.data['voucher_id'] = res.data;
                    if (!is_continue) {
                        setTimeout(() => {
                            this.router.navigate(['/financial/receipt-voucher/view/' + this.data['voucher_id']]);
                        }, 500);
                    }
                } else {
                    this.toastr.error(res.message);
                }
            } catch (e) {
                console.log(e);
            }
        });
    }

    confirmModal(type, is_draft?) {
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                if (type) {
                    this.createVoucher(type, is_draft);
                } else {
                    this.router.navigate(['/financial/receipt-voucher']);
                }
            }
        }, dismiss => { });
        modalRef.componentInstance.message = this.messageConfig[type || 'default'];
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }

    fetchMoreCustomer(data?) {
        this.data['page']++;
        if (this.data['page'] > this.data['total_page']) {
            return;
        }
        const params = { page: this.data['page'], length: 15 };
        if (this.data['searchKey']) {
            params['company_name'] = this.data['searchKey'];
        }
        this.orderService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = this.listMaster['customer'].concat(res.data.rows);
            this.data['total_page'] = res.data.total_page;
        });
    }

    searchCustomer(key) {
        this.data['searchKey'] = key;
        const params = { page: this.data['page'], length: 15 };
        if (key) {
            params['company_name'] = key;
        }
        this.orderService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = res.data.rows;
            this.data['total_page'] = res.data.total_page;
        });
    }
}
