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
import { InvoiceEditKeyService } from './keys.edit.control';

import { HotkeysService } from 'angular2-hotkeys';
import * as _ from 'lodash';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';
import { ReceiptVoucherService } from './../receipt-voucher.service';

import { PaymentGatewayModalComponent } from '../modals/payment-gateway/payment-gateway.modal';
import { TableService } from './../../../../services/table.service';

import * as moment from 'moment';
import { PaymentInformModalComponent } from '../modals/payment-inform/payment-inform.modal';


@Component({
    selector: 'app-edit-receipt-voucher',
    templateUrl: './receipt-voucher.edit.component.html',
    styleUrls: ['../receipt-voucher.component.scss'],
    providers: [OrderService, ReceiptVoucherService, HotkeysService, TableService, InvoiceEditKeyService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
    animations: [routerTransition()]
})

export class ReceiptVoucherEditComponent implements OnInit {

    public generalForm: FormGroup;
    public listMaster = {};
    public selectedIndex = 0;
    public data = {};

    public messageConfig = {
        '2': 'Are you sure that you want to submit this receipt voucher?',
        '3': 'Are you sure that you want to Save & Validate this receipt voucher?',
        'error': 'This Receipt Voucher is missing some mandatory fields, please fulfill them before submitting.',
        'error_elec': 'There is (are) missing mandatory field(s) in the receipt voucher. Please fulfill before submitting it.',
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
        public keyService: InvoiceEditKeyService,
        public tableService: TableService,
        private voucherService: ReceiptVoucherService,
        private dt: DatePipe) {
        this.generalForm = fb.group({
            'approver_id': [null, Validators.required],
            'company_id': [null, Validators.required],
            'warehouse_id': [null, Validators.required],
            'payment_method': [null, Validators.required],
            'description': [null],
            'electronic': [null, Validators.required],
            'price_received': [null, Validators.required],
            'payment_date': [null, Validators.required],
            'cd': [null],
            'updated_by': [null],
            'updated_date': [null],
            'created_by': [null],
            'gl_account': [null, Validators.required],
            'check_no': [null, Validators.required],
            'ref_no': [null, Validators.required],
            'remain_amt': [null],
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getListInvoiceAndMemo';
        this.tableService.context = this;

        //  Init Key
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    async ngOnInit() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        this.data['user'] = user;
        this.data['voucher_id'] = this.route.snapshot.params.id;
        // List Master
        this.getListReference();

        this.generalForm.patchValue({
            approver_id: user.id,
            updated_by: user.full_name,
            created_by: user.full_name,
            updated_date: moment().format('MM/DD/YYYY'),
            payment_date: moment().format('MM/DD/YYYY'),
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

        // Get Detail Voucher
        this.getVoucherDetail();
    }

    /**
     * Mater Data
     */
    getVoucherDetail() {
        this.voucherService.getDetailReceiptVoucher(this.data['voucher_id']).subscribe(async res => {
            this.data['voucher'] = res.data;
            this.generalForm.patchValue({
                ...res.data,
                payment_method: res.data.payment_method_id,
                updated_date: res.data.updated_at,
                check_no: +res.data.number,
                ref_no: +res.data.number,
            });
            this.list.items = res.data.items.map(item => {
                item.code = item.document_no;
                item.status_name = item.status;
                item.applied_amt = item.price_apply;
                item.payment_term_name = item.payment_term.des;
                return item;
            });
            // Init Change Event
            this.onChangePayer(1);
            this.onChangeWareHouse(1);
            await this.onChangePaymentMethodType(1);
            this.onChangePaymentMethod(1);
            this.updateTotal();
        });
    }

    getListReference() {
        this.listMaster['yes_no_options'] = [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }];
        this.getListAccountGL();
        this.orderService.getOrderReference().subscribe(res => {
            Object.assign(this.listMaster, res.data);
        });
    }

    getListAccountGL() {
        this.voucherService.getListAccountGL().subscribe(res => {
            const accountList = res['data'];
            const tempAccountList = [];
            accountList.forEach(item => {
                tempAccountList.push({ 'name': item.name, 'level': item.level, 'disabled': true }, ...item.children);
            });
            this.listMaster['account'] = tempAccountList;
        });
    }

    getListInvoiceAndMemo() {
        const params = {
            code: this.data['search'],
            warehouse_id: this.generalForm.value.warehouse_id,
            company_id: this.generalForm.value.company_id,
        };

        if (!params.warehouse_id || !params.company_id) {
            return;
        }

        Object.keys(params).forEach(key => {
            if (!params[key]) {
                delete params[key];
            }
        });

        this.voucherService.getListInvoiceAndMemoById(this.data['voucher_id'], params).subscribe(res => {
            this.list.items = res.data.rows || [];
            this.data['loadItem'] = true;
            this.tableService.matchPagingOption(res.data);
            this.updateTotal();
        });
    }

    resetChangeData(flag?, init?) {
        if (flag === 'paymentMethodType') {
            const id = this.generalForm.value.electronic;
            if (!id) {
                this.generalForm.get('check_no').setValidators([Validators.required]);
                this.generalForm.get('ref_no').setValidators([Validators.required]);
                this.generalForm.get('price_received').setValidators([Validators.required]);
            } else {
                this.generalForm.get('check_no').setValidators(null);
                this.generalForm.get('ref_no').setValidators(null);
                this.generalForm.get('price_received').setValidators(null);
            }
            if (!init) {
                this.generalForm.patchValue({
                    payment_method: null,
                    check_no: null,
                    ref_no: null,
                    price_received: null,
                });
            }
            this.generalForm.updateValueAndValidity();
        }
    }

    getListPaymentMethod(id, flag) {
        return new Promise(resolve => {
            this.voucherService.getPaymentMethodElectronic(id).subscribe(res => {
                this.listMaster['payment_method'] = res.data;
                this.resetChangeData('paymentMethodType', flag);
                resolve(true);
            });
        });
    }

    getDetailCustomerById(company_id) {
        this.orderService.getDetailCompany(company_id).subscribe(res => {
            try {
                this.data['payer'] = res.data;
                this.listMaster['customer'] = [{ id: this.data['payer'].company_id, company_name: this.data['payer'].company_name }, ...this.listMaster['customer']];
            } catch (e) {
                console.log(e);
            }
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

    onChangePaymentMethod(flag?) {
        const id = this.generalForm.get('payment_method').value;
        const payment = (this.listMaster['payment_method'] || []).find(item => +item.id === +id);
        this.data['payment'] = payment || {};

        if (!this.generalForm.value.electronic) {
            if (id === 4) {
                this.generalForm.get('check_no').setValidators([Validators.required]);
                this.generalForm.get('ref_no').setValidators(null);
            }

            if ([5, 6].indexOf(id) !== -1) {
                this.generalForm.get('check_no').setValidators(null);
                this.generalForm.get('ref_no').setValidators(null);
            }
            if ([4, 5, 6].indexOf(id) === -1) {
                this.generalForm.get('ref_no').setValidators([Validators.required]);
                this.generalForm.get('check_no').setValidators(null);
            }
        }

        this.generalForm.patchValue({
            check_no: (flag) ? this.generalForm.value.check_no : null,
            ref_no: (flag) ? this.generalForm.value.ref_no : null,
        });

        this.generalForm.updateValueAndValidity();
    }

    onChangeWareHouse(flag?) {
        const id = this.generalForm.get('warehouse_id').value;
        if (!id) {
            return;
        }
        this.data['search'] = null;
        if (!flag) {
            this.getListInvoiceAndMemo();
        }
    }

    onChangePayer(flag?) {
        const id = this.generalForm.get('company_id').value;
        if (!id) {
            return;
        }
        this.data['search'] = null;
        this.getDetailCustomerById(id);
        if (!flag) {
            this.getListInvoiceAndMemo();
        }
    }

    async onChangePaymentMethodType(flag?) {
        const id = this.generalForm.get('electronic').value;
        if (!id && id !== 0) {
            return;
        }
        await this.getListPaymentMethod(id, flag);
        if (!flag) {
            this.getListInvoiceAndMemo();
        }
    }

    clearPayment() {
        this.data['search'] = null;
        // this.getListInvoiceAndMemo();
        const checkedList = this.list.checklist.map(item => item.id);
        this.list.items.forEach(item => {
            if (checkedList.length > 0 && checkedList.indexOf(item.id) !== -1) {
                item.applied_amt = 0;
            }
        });
    }

    updateTotal(_item?) {
        if (_item) {
            let total = 0;
            this.list.items.filter(it => it.id !== _item.id).map(j => {
                total += (+j.applied_amt || 0);
            });
            const remain = this.generalForm.value.price_received - total;
            this.data['remain'] = remain;
        }

        this.data['summary'] = {
            total: 0,
            balance_total: 0,
        };

        this.list.items.map(item => {
            this.data['summary'].total += (+item.applied_amt || 0);
            this.data['summary'].balance_total += (+item.balance_price || 0);
        });

        this.data['summary'].change = this.generalForm.value.price_received - this.data['summary'].total;
        this.generalForm.patchValue({ remain_amt: this.data['summary'].change });

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

    updateVoucher(type, is_draft?, is_continue?) {
        if (!is_draft && (this.generalForm.invalid || (this.data['summary'] && !this.data['summary'].total))) {
            this.toastr.error(this.messageConfig.error);
            this.data['showError'] = true;
            return;
        }

        const items = this.list.items.filter(i => i.applied_amt).map(item => {
            item.line_item_id = item.line_item_id || item.id;
            item.price_apply = item.applied_amt;
            return item;
        });
        type = (type === 'overpayment') ? 2 : (type === 'overpayment-approve') ? 3 : type;
        const params = {
            ...this.generalForm.value,
            items,
            status: type,
            number: this.generalForm.value.check_no || this.generalForm.value.ref_no,
            payment_date: moment(this.generalForm.value.payment_date).format('MM/DD/YYYY'),
        };

        this.voucherService.updateVoucher(this.data['voucher_id'], params).subscribe(res => {
            try {
                this.data['voucher_id'] = res.data['id'];
                this.toastr.success(res.message);
                if (!is_continue) {
                    setTimeout(() => {
                        this.router.navigate(['/financial/receipt-voucher/view/' + this.data['voucher_id']]);
                    }, 500);
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
                    this.updateVoucher(type, is_draft);
                } else {
                    this.router.navigate(['/financial/receipt-voucher']);
                }
            }
        }, dismiss => { });
        modalRef.componentInstance.message = this.messageConfig[type || 'default'];
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }

    confirmElectricModal() {
        this.data['showError'] = true;
        if (this.generalForm.invalid || (this.data['summary'] && !this.data['summary'].total)) {
            this.toastr.error(this.messageConfig.error_elec);
            return;
        }
        this.paymentModal();
    }

    paymentModal() {
        const modalRef = this.modalService.open(PaymentGatewayModalComponent, { size: 'lg' });
        modalRef.result.then(res => {
            if (res) {
                const items = this.list.items.filter(i => i.applied_amt).map(item => {
                    item.price_apply = item.applied_amt;
                    item.line_item_id = item.line_item_id || item.id;
                    return item;
                });

                const params = { ... this.generalForm.value, items, status: 1 };
                this.updatePayment(res, items);
            }
        }, dismiss => { });

        modalRef.componentInstance.data = {
            user: this.data['user'],
            payer: this.data['payer'],
            total_amount: this.data['summary'].total,
        };
    }

    updatePayment(res, items) {
        const params = { ... this.generalForm.value, ...res, items, status: 2 };
        this.voucherService.updateVoucher(this.data['voucher_id'], params).subscribe(data => {
            this.resultPaymentModal(1, { ...res, respone: data });
        }, err => {
            this.resultPaymentModal(0, { ...res, respone: err });
        });
    }

    resultPaymentModal(type, data) {
        const modalRef = this.modalService.open(PaymentInformModalComponent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                this.confirmElectricModal();
            } else {
                this.router.navigate(['/financial/receipt-voucher/view/' + this.data['voucher_id']]);
            }
        }, dismiss => { });
        modalRef.componentInstance.type = type;
        modalRef.componentInstance.data = data;
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
