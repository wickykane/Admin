import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { cdArrowTable } from '../../../../shared';

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

import { StorageService } from '../../../../services/storage.service';
import { PaymentGatewayModalComponent } from '../modals/payment-gateway/payment-gateway.modal';
import { TableService } from './../../../../services/table.service';

import * as moment from 'moment';
import { ROUTE_PERMISSION } from '../../../../services/route-permission.config';
import { PaymentInformModalComponent } from '../modals/payment-inform/payment-inform.modal';
import { FinancialService } from './../../financial.service';

@Component({
    selector: 'app-create-receipt-voucher',
    templateUrl: './receipt-voucher.create.component.html',
    styleUrls: ['../receipt-voucher.component.scss'],
    providers: [FinancialService, OrderService, ReceiptVoucherService, HotkeysService, TableService, InvoiceCreateKeyService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ReceiptVoucherCreateComponent implements OnInit {
    /**
     * Variable Declaration
     */

    public generalForm: FormGroup;
    public searchForm: FormGroup;
    public listMaster = {};
    public selectedIndex = 0;
    public data = {};
    public savedItems = {
        totalAmount: 0,
        usedAmount: 0,
        remainAmount: 0,
        items: []
    };

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
    public isInstallQuickbook = false;

    /**
     * Init Data
     */
    @ViewChild(cdArrowTable) table: cdArrowTable;
    constructor(
        private vRef: ViewContainerRef,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        public toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private orderService: OrderService,
        private _hotkeysService: HotkeysService,
        public keyService: InvoiceCreateKeyService,
        public tableService: TableService,
        private finacialService: FinancialService,
        private storage: StorageService,
        private voucherService: ReceiptVoucherService,
        private dt: DatePipe) {
        this.searchForm = fb.group({
            code: 1
        });
        this.generalForm = fb.group({
            'approver_id': [null, Validators.required],
            'company_id': [null, Validators.required],
            'warehouse_id': [null, Validators.required],
            'payment_method': [null, Validators.required],
            'description': [null],
            'electronic': [null, Validators.required],
            'price_received': [null, Validators.required],
            'payment_date': [null, Validators.required],
            'cd': [null, Validators.required],
            'updated_by': [null],
            'updated_date': [null],
            'created_by': [null],
            'gl_account': [null, Validators.required],
            'check_no': [null, Validators.required],
            'ref_no': [null],
            'remain_amt': [null],
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getListInvoiceAndMemo';
        this.tableService.context = this;
        this.tableService.pagination.length = 1000;

        //  Init Key
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    async ngOnInit() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        this.listMaster['permission'] = this.storage.getRoutePermission(this.router.url);
        this.data['user'] = user;

        // List Master
        this.getListReference();
        this.getQuickbookSettings();
        // Lazy Load filter
        this.data['page'] = 1;
        const params = { page: this.data['page'], length: 100 };
        this.orderService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = res.data.rows;
            this.data['total_page'] = res.data.total_page;
        });
        this.searchKey.debounceTime(300).subscribe(key => {
            this.data['page'] = 1;
            this.searchCustomer(key);
        });

        // Init Change Event
        this.onChangeWareHouse();
        this.onChangePayer();
        this.onChangePaymentMethodType();

        // Init Value
        this.generalForm.patchValue({
            approver_id: user.id,
            updated_by: user.full_name,
            created_by: user.full_name,
            updated_date: moment().format('MM/DD/YYYY h:mm:ss'),
            payment_date: moment().format('MM/DD/YYYY'),
            electronic: 0,
        });

        this.data['invoice_id'] = this.route.snapshot.queryParams.invoice_id;
        if (this.data['invoice_id']) {
            this.getDetailInvoice();
        }
        this.getListApprover();
    }
    getListApprover() {
        const params = {
            permissions: ROUTE_PERMISSION['receipt-voucher'].approve,
        };
        this.finacialService.getListApprover(params).subscribe(res => {
            this.listMaster['approver'] = res.data;
            const defaultValue = (this.listMaster['approver'].find(item => item.id === this.generalForm.value.approver_id) || {}).id || null;
            this.generalForm.patchValue({ approver_id: defaultValue });
        });
    }
    /**
     * Mater Data
     */
    getDetailInvoice() {
        this.finacialService.getDetailInvoice(this.data['invoice_id']).subscribe(res => {
            const data = res.data;
            this.generalForm.patchValue({
                company_id: data.company_id,
                warehouse_id: data.warehouse_id,
                electronic: 1,
                payment_method: 27,
                gl_account: 162,
            });

            this.generalForm.get('check_no').clearValidators();
            this.generalForm.get('check_no').updateValueAndValidity();
            this.generalForm.get('price_received').clearValidators();
            this.generalForm.get('price_received').updateValueAndValidity();

            this.getListInvoiceAndMemo(data.inv_num, data.tot_amt);
        });
    }

    getQuickbookSettings() {
        this.finacialService.getSettingInfoQuickbook().subscribe(
            res => {
                this.isInstallQuickbook = res.data.state === 'authorized' ? true : false;
            }, err => {}
        );
    }

    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    getListReference() {
        this.listMaster['yes_no_options'] = [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }];
        this.getListAccountGL();
        this.orderService.getOrderReference().subscribe(res => {
            Object.assign(this.listMaster, res.data);
            this.refresh();
        });

        this.voucherService.getVoucherMasterData().subscribe(res => {
            this.generalForm.get('cd').patchValue(res.data.cd);
            this.refresh();
        });
        this.refresh();
    }

    getListAccountGL() {
        this.voucherService.getListAccountGL().subscribe(res => {
            const accountList = res['data'];
            const tempAccountList = [];
            accountList.forEach(item => {
                tempAccountList.push({ 'name': item.name, 'level': item.level, 'disabled': true }, ...item.children);
            });
            this.listMaster['account'] = tempAccountList;
            this.refresh();
        });
    }

    getListInvoiceAndMemo(code?, tot_amt?) {
        if (this.data['invoice_id'] && !code) {
            this.saveCurrentItems(true);
            return;
        }
        const params = {
            code: code || this.data['search'],
            warehouse_id: this.generalForm.value.warehouse_id,
            company_id: this.generalForm.value.company_id,
            ...this.tableService.getParams(),
        };

        if (!params.warehouse_id || !params.company_id) {
            return;
        }

        Object.keys(params).forEach(key => {
            if (!params[key]) {
                delete params[key];
            }
        });
        this.voucherService.getListInvoiceAndMemo(params).subscribe(res => {
            // this.data['invoice_id'] = null;
            this.list.items = res.data.rows || [];
            // this.tableService.matchPagingOption(res.data);
            if (code) {
                const index = this.list.items.findIndex(item => item.code === code);
                this.list.items[index].applied_amt = this.list.items[index].balance_price;
                this.list.items[index].is_checked = true;
            }
            if (!this.savedItems['items'].length) {
                this.savedItems['items'] = this.list.items;
            } else {
                this.list.items.forEach(item => {
                    const index = this.savedItems['items'].findIndex(savedItem => savedItem.id === item.id);
                    if (index < 0) {
                        this.savedItems['items'].push(item);
                    } else {
                        item['is_checked'] = this.savedItems['items'][index]['is_checked'] || false;
                        item['applied_amt'] = this.savedItems['items'][index]['applied_amt'];
                    }
                });
            }
            this.checkAllItem = this.list.items.every(item => item.is_checked);
            this.updateTotal();
            this.refresh();
        });
    }

    resetChangeData(flag?) {
        if (flag === 'paymentMethodType' && !this.data['invoice_id']) {
            const id = this.generalForm.value.electronic;
            if (!id) {
                this.generalForm.get('check_no').setValidators([Validators.required]);
                // this.generalForm.get('ref_no').setValidators([Validators.required]);
                this.generalForm.get('price_received').setValidators([Validators.required]);
            } else {
                this.generalForm.get('check_no').setValidators(null);
                // this.generalForm.get('ref_no').setValidators(null);
                this.generalForm.get('price_received').setValidators(null);
            }
            this.generalForm.patchValue({
                payment_method: null,
                check_no: null,
                ref_no: null,
                price_received: null,
            });
            this.generalForm.updateValueAndValidity();
            this.refresh();
        }
        if (flag === 'paymentMethodType') {
            this.generalForm.patchValue({
                payment_method: null
            });
            this.generalForm.updateValueAndValidity();
            this.refresh();
        }
    }

    getListPaymentMethod(id) {
        return new Promise(resolve => {
            this.voucherService.getPaymentMethodElectronic(id).subscribe(res => {
                this.listMaster['payment_method'] = res.data;
                this.resetChangeData('paymentMethodType');
                this.onChangePaymentMethod();
                this.refresh();
                resolve(true);
            });
        });
    }

    getDetailCustomerById(company_id) {
        this.orderService.getDetailCompany(company_id).subscribe(res => {
            try {
                this.data['payer'] = res.data;
                const existed = (this.listMaster['customer'] || []).find(item => item.id === this.data['payer'].company_id);
                if (!existed) {
                    this.listMaster['customer'] = [{ id: this.data['payer'].company_id, company_name: this.data['payer'].company_name , name: this.data['payer'].company_name}, ...this.listMaster['customer']];
                }
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }
    /**
     * Internal Function
     */
    // Table event
    selectData(ev) {
        console.log(ev);
        const button = this.table.element.nativeElement.querySelectorAll('td label input');
        if (button && button[this.selectedIndex]) {
            button[this.selectedIndex].click();
        }
    }

    checkAll(ev) {
        this.list.items.forEach(x => x.is_checked = ev.target.checked);
        this.list.checklist = this.list.items.filter(item => item.is_checked);
        this.updateCheckedSavedItems();
        this.fillAppliedAmountToAllItem();
        this.refresh();
    }

    isAllChecked(index) {
        this.checkAllItem = this.list.items.every(item => item.is_checked);
        this.list.checklist = this.list.items.filter(item => item.is_checked);
        this.updateCheckedSavedItems();
        this.generalForm.value.electronic ? this.onCheckItemManual(index) : this.onCheckItemAutoFill(index);
        this.refresh();
    }

    onCheckItemAutoFill(index) {
        if (!this.list['items'][index].is_checked) {
            const savedIndex = this.savedItems['items'].findIndex(savedItem => savedItem.id === this.list['items'][index].id);
            this.savedItems['items'][savedIndex]['applied_amt'] = 0;
            this.list['items'][index]['applied_amt'] = 0;
            this.fillAppliedAmountToAllItem(index, false);
        } else {
            this.fillAppliedAmountToAllItem();
        }
    }

    onCheckItemManual(index) {
        const savedIndex = this.savedItems['items'].findIndex(savedItem => savedItem.id === this.list['items'][index].id);
        if (this.list['items'][index].is_checked) {
            this.savedItems['items'][savedIndex]['applied_amt'] = _.round(this.savedItems['items'][savedIndex]['balance_price'], 2);
            this.list['items'][index]['applied_amt'] = _.round(this.list['items'][index]['balance_price'], 2);
        } else {
            this.savedItems['items'][savedIndex]['applied_amt'] = 0;
            this.list['items'][index]['applied_amt'] = 0;
        }
        this.updateTotal(this.savedItems['items'][savedIndex]);
    }

    refreshSavedItems(isClearAll) {
        if (isClearAll) {
            this.savedItems = {
                totalAmount: 0,
                usedAmount: 0,
                remainAmount: 0,
                items: []
            };
        } else {
            this.savedItems['items'] = [];
            this.savedItems['remainAmount'] = this.savedItems['totalAmount'];
            this.savedItems['usedAmount'] = 0;
        }
    }

    updateAmountReceived() {
        const newAmount = parseFloat(this.generalForm.value['price_received']) || 0;
        if (this.savedItems['totalAmount'] !== newAmount) {
            this.savedItems['totalAmount'] = newAmount;
            this.savedItems['remainAmount'] = newAmount;
            this.savedItems['usedAmount'] = 0;
            this.fillAppliedAmountToAllItem();
        }
    }

    fillAppliedAmountToAllItem(itemIndex?, isChangePrice?) {
        this.savedItems['remainAmount'] = parseFloat(this.generalForm.value['price_received']) || 0;
        const savedItemIndex = (itemIndex !== undefined && itemIndex !== null) ? this.savedItems['items'].findIndex(savedItem => savedItem.id === this.list.items[itemIndex]['id']) : null;

        if (savedItemIndex !== -1 && savedItemIndex !== null) {
            if (isChangePrice) {
                this.savedItems['items'][savedItemIndex]['applied_amt'] = this.list['items'][itemIndex]['applied_amt'];
            }
            if (this.generalForm.value.electronic) {
                this.list['items'][itemIndex]['applied_amt'] = Math.min(this.list['items'][itemIndex]['balance_price'], this.list['items'][itemIndex]['applied_amt']);
                this.savedItems['items'][savedItemIndex]['applied_amt'] = this.list['items'][itemIndex]['applied_amt'];
                this.updateTotal(this.savedItems['items'][savedItemIndex]);
                return;
            }
            this.fillSelectedItem(savedItemIndex);
        }
        this.fillAppliedAmount(savedItemIndex);
        this.updateCurrentItems();
    }

    fillAppliedAmount(savedItemIndex?) {
        this.savedItems['usedAmount'] = 0;
        this.savedItems['items'].forEach((savedItem, index) => {
            if (!this.generalForm.value.electronic) {
                const isFillAllItems = (savedItemIndex === undefined || savedItemIndex === null);
                const isFillFromIndex = (savedItemIndex !== undefined && savedItemIndex !== null && index > savedItemIndex);
                if (isFillAllItems || isFillFromIndex) {
                    savedItem['applied_amt'] = savedItem.is_checked ? Math.min(savedItem['balance_price'], this.savedItems['remainAmount']) : 0;
                    savedItem['applied_amt'] = _.round(savedItem['applied_amt'], 2);
                }
                this.savedItems['usedAmount'] += savedItem['applied_amt'];
                this.savedItems['remainAmount'] = this.savedItems['totalAmount'] - this.savedItems['usedAmount'];
            } else {
                savedItem['applied_amt'] = !savedItem.is_checked ? 0 : ( savedItem['applied_amt'] ? savedItem['applied_amt'] : _.round(savedItem['balance_price'], 2) );
            }
            this.updateTotal(savedItem);
        });
    }

    fillSelectedItem(itemIndex) {
        this.savedItems['items'][itemIndex]['applied_amt'] = Math.min(
            this.savedItems['items'][itemIndex]['applied_amt'],
            this.savedItems['items'][itemIndex]['balance_price'],
            (this.savedItems['remainAmount'] - this.calculateUsedAmount(itemIndex)));
        this.savedItems['items'][itemIndex]['applied_amt'] = _.round(this.savedItems['items'][itemIndex]['applied_amt'], 2);
    }

    calculateTotalUsedAmount() {
        let usedPrice = 0;
        this.savedItems['items'].forEach((item, index) => {
            console.log(item);
            usedPrice += Number(item['applied_amt']) || 0;
        });
        return _.round(usedPrice, 2);
    }

    calculateUsedAmount(savedItemIndex) {
        let usedPrice = 0;
        this.savedItems['items'].forEach((item, index) => {
            if (index < savedItemIndex) {
                usedPrice += Number(item['applied_amt']) || 0;
            }
        });
        return _.round(usedPrice, 2);
    }

    updateCheckedSavedItems() {
        this.list.items.forEach(item => {
            const index = this.savedItems['items'].findIndex(savedItem => savedItem.id === item.id);
            if (index >= 0 && (item['is_checked'] !== this.savedItems['items'][index]['is_checked'])) {
                this.savedItems['items'][index]['is_checked'] = item['is_checked'];
            }
        });
    }

    saveCurrentItems(isResetItem?) {
        this.list.items.forEach(item => {
            if (isResetItem) {
                item.applied_amt = 0;
                item.is_checked = false;
            }
            const index = this.savedItems['items'].findIndex(savedItem => savedItem.id === item.id);
            if (index < 0) {
                this.savedItems['items'].push(item);
            } else {
                this.savedItems['items'][index] = item;
            }
        });
        this.checkAllItem = this.list.items.every(item => item.is_checked);
        this.updateTotal();
    }

    updateCurrentItems() {
        this.list.items.forEach(item => {
            const index = this.savedItems['items'].findIndex(savedItem => savedItem.id === item.id);
            if (index >= 0) {
                item['is_checked'] = this.savedItems['items'][index]['is_checked'] || false;
                item['applied_amt'] = this.savedItems['items'][index]['applied_amt'];
            }
        });
    }

    onChangePaymentMethod() {
        this.generalForm.get('payment_method').valueChanges.subscribe(id => {
            const payment = this.listMaster['payment_method'].find(item => +item.id === +id);
            this.data['payment'] = payment || {};

            if (!this.generalForm.value.electronic) {
                if (id === 4) {
                    this.generalForm.get('check_no').setValidators([Validators.required]);
                    // this.generalForm.get('ref_no').setValidators(null);
                }

                if ([5, 6].indexOf(id) !== -1) {
                    this.generalForm.get('check_no').setValidators(null);
                    // this.generalForm.get('ref_no').setValidators(null);
                }
                if ([4, 5, 6].indexOf(id) === -1) {
                    // this.generalForm.get('ref_no').setValidators([Validators.required]);
                    this.generalForm.get('check_no').setValidators(null);
                }
            }

            this.generalForm.patchValue({
                check_no: null,
                ref_no: null,
            });

            this.generalForm.updateValueAndValidity();
            this.refresh();
        });
    }

    onChangeWareHouse() {
        this.generalForm.get('warehouse_id').valueChanges.subscribe(id => {
            if (!id) {
                return;
            }
            setTimeout(() => {
                this.refreshSavedItems(false);
                this.data['search'] = null;
                // this.getListInvoiceAndMemo();
                this.tableService.searchAction();
            });
        });
    }

    onChangePayer() {
        this.generalForm.get('company_id').valueChanges.subscribe(id => {
            if (!id) {
                return;
            }
            setTimeout(() => {
                this.refreshSavedItems(false);
                this.data['search'] = null;
                this.getDetailCustomerById(id);
                // this.getListInvoiceAndMemo();
                this.tableService.searchAction();
            });
        });
    }

    onChangePaymentMethodType() {
        this.generalForm.get('electronic').valueChanges.subscribe(id => {
            if (!id && id !== 0) {
                return;
            }
            this.refreshSavedItems(true);
            this.getListPaymentMethod(id);
            // this.getListInvoiceAndMemo();
            this.tableService.searchAction();
        });
    }

    clearPayment() {
        this.refreshSavedItems(false);
        this.data['search'] = null;
        this.tableService.searchAction();
        // const checkedList = this.list.checklist.map(item => item.id);
        // this.list.items.forEach(item => {
        //     if (checkedList.length > 0 && checkedList.indexOf(item.id) !== -1) {
        //         item.applied_amt = 0;
        //     }
        // });
    }

    updateTotal(_item?) {
        if (_item) {
            let total = 0;
            this.list.items.filter(it => it.id !== _item.id).map(j => {
                total += (+j.applied_amt || 0);
            });
            const remain = this.generalForm.value.price_received - total;
            this.data['remain'] = remain;
            this.refresh();
        }

        this.data['summary'] = {
            total: 0,
            balance_total: 0,
            balance_due_total: 0,
            applied_amt_total: 0,
            price_total: 0,
        };

        this.list.items.map(item => {
            this.data['summary'].total += (+item.applied_amt || 0);
            this.data['summary'].balance_total += (+item.balance_price || 0);
            this.data['summary'].applied_amt_total += (+item.applied_amt || 0);
            this.data['summary'].price_total += (+item.total_price || 0);
        });
        this.data['summary'].balance_due_total = this.data['summary'].balance_total - this.data['summary'].applied_amt_total;

        this.data['summary'].change = (this.generalForm.value.price_received - this.data['summary'].total).toFixed(2);
        this.generalForm.patchValue({ remain_amt: this.data['summary'].change });
        this.refresh();
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
        if (!is_draft && (this.generalForm.invalid || (this.data['summary'] && !this.data['summary'].total))) {
            this.data['showError'] = true;
            this.toastr.error(this.messageConfig.error);
            return;
        }

        // const items = this.list.items.filter(i => i.applied_amt).map(item => {
        //     item.line_item_id = item.id;
        //     item.price_apply = item.applied_amt;
        //     return item;
        // });
        const items = this.savedItems['items'].filter(i => i.applied_amt).map(item => {
            item.line_item_id = item.id;
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

        this.voucherService.createVoucher(params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                if (type === 3 && this.isInstallQuickbook) {
                    this.finacialService.syncReceiptVoucherToQuickbook(res.data['id']).subscribe(
                        _res => {
                            try {
                                const result = JSON.parse(_res['_body']);
                                this.toastr.success(`Receipt Voucher ${result.data[0].entity.PaymentRefNum} has been sync to Quickbooks successfully.`);
                            } catch (err) {}
                        },
                        err => {
                            this.toastr.error(`Cannot sync Receipt Voucher to Quickbooks.`);
                        }
                    );
                }
                if (!is_continue) {
                    this.data['voucher_id'] = res.data['id'];
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
                    item.line_item_id = item.id;
                    item.price_apply = item.applied_amt;
                    return item;
                });

                const params = { ... this.generalForm.value, items, status: 1, price_received: this.data['summary'].total };
                if (this.data['voucher_id']) {
                    this.updatePayment(res, items);
                } else {
                    this.voucherService.createVoucher(params).subscribe(result => {
                        try {
                            this.data['voucher_id'] = result.data['id'];
                            this.updatePayment(res, items);
                        } catch (e) {
                            console.log(e);
                        }
                    }, err => {
                        this.resultPaymentModal(0, err);
                    });
                }
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
        const params = { page: this.data['page'], length: 100 };
        if (this.data['searchKey']) {
            params['company_name'] = this.data['searchKey'];
        }
        this.orderService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = this.listMaster['customer'].concat(res.data.rows);
            this.data['total_page'] = res.data.total_page;
            this.refresh();
        });
    }

    searchCustomer(key) {
        this.data['searchKey'] = key;
        const params = { page: this.data['page'], length: 100 };
        if (key) {
            params['company_name'] = key;
        }
        this.orderService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = res.data.rows;
            this.data['total_page'] = res.data.total_page;
            this.refresh();
        });
    }
    selectTable() {
        this.selectedIndex = 0;
        this.table.scrollToTable();
        setTimeout(() => {
            const button = this.table.element.nativeElement.querySelectorAll('td');
            if (button && button[this.selectedIndex]) {
                button[this.selectedIndex].focus();
            }
        });
        this.refresh();
    }
    selectAll() {
        this.table.element.nativeElement.querySelector('th label input').click();
       }
}
