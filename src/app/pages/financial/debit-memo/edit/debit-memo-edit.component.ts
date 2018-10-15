import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../../services/table.service';

import { Subject } from 'rxjs/Subject';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';

import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { NgbDateCustomParserFormatter } from '../../../../shared/helper/dateformat';

import { DebitMemoCreateKeyService } from '../create/keys.create.control';

import { ItemsOrderDebitModalContent } from '../modals/items-order/items-order.modal';
import { MiscItemsDebitModalContent } from '../modals/misc-items/misc-items.modal';

import { FinancialService } from '../../financial.service';
import { DebitMemoService } from '../debit-memo.service';

import { HotkeysService } from 'angular2-hotkeys';
import * as  _ from 'lodash';
import * as moment from 'moment';

@Component({
    selector: 'app-debit-memo-edit',
    templateUrl: './debit-memo-edit.component.html',
    styleUrls: ['./debit-memo-edit.component.scss'],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DebitMemoCreateKeyService, HotkeysService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }]
})
export class DebitMemoEditComponent implements OnInit {

    //#region initialize variables
    @ViewChild('fieldNote') noteText: ElementRef;

    public listMaster = {
        customers: [],
        contacts: [],
        document_types: [],
        sale_orders: [],
        payment_methods: [],
        payment_terms: [],
        sales_person: [],
        approvers: [],
        bill_labels: []
    };
    public contactDetail = {};
    public orderInformation = {
        bill_info: {},
        ship_info: {},
        shipping_method: {}
    };
    public listLineItems = [];
    public listDeletedLineItem = [];
    public listTaxs = [];
    public todayDate = moment().format('YYYY-MM-DD');
    public payment_term_date = 0;

    public isClickedSave = false;
    public isSaveDraft = false;
    public isCreateNew = false;
    public isReSelectOrder = false;
    public data = {};
    public currentDt;

    public decimalAllowed = 2;

    public searchKey = new Subject<any>(); // Lazy load filter

    public debitMemoForm: FormGroup;
    public debitId = null;
    public debitDetail = {};
    public currentUser = {};
    public isInstallQuickbook = false;
    //#endregion initialize variables

    //#region contructor
    constructor(public router: Router,
        private route: ActivatedRoute,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        private cd: ChangeDetectorRef,
        private modalService: NgbModal,
        private _hotkeysService: HotkeysService,
        public keyService: DebitMemoCreateKeyService,
        public tableService: TableService,
        public debitService: DebitMemoService,
        public financialService: FinancialService,
        private renderer: Renderer) {

        this.debitMemoForm = fb.group({
            company_id: [null, Validators.required],
            contact_id: [null, Validators.required],

            no: [null, Validators.required],
            issue_date: [null, Validators.required],
            doc_type: [1, Validators.required],
            order_id: [null, Validators.required],

            payment_method_id: [null, Validators.required],
            payment_term_id: [null, Validators.required],
            due_date: [null, Validators.required],
            sale_person_id: [null, Validators.required],
            approver_id: [null, Validators.required],
            sts: [1],

            billing_id: [null, Validators.required],
            shipping_id: [null, Validators.required],
            // carrier_id: [null, Validators.required],

            sub_total_price: [0, Validators.required],
            tax: [0, Validators.required],
            total_price: [0, Validators.required],

            note: [null]
        });

        this.listMaster['document_types'] = [
            {
                id: 1,
                name: 'Sales Order'
            }
        ];
    }
    //#endregion constructor

    //#region lifecycle hook
    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.debitId = this.route.snapshot.paramMap.get('id');
        // Lazy Load filter
        this.data['page'] = 1;
        this.searchKey.subscribe(key => {
            this.data['page'] = 1;
            this.searchCustomer(key);
        });
        this.getQuickbookSettings();
        this.getDebitDetail();
        this.getListPaymentMethod();
        this.getListPaymentTerms();
        this.getListSalePerson();
        this.getListApprover();
        //  Init hot keys
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
        this.currentDt = (new Date()).toISOString().slice(0, 10);
    }
    //#endregion lifecycle hook

    //#region load master data
    refresh() {
        this.cd.detectChanges();
    }

    getQuickbookSettings() {
        this.financialService.getSettingInfoQuickbook().subscribe(
            res => {
                this.isInstallQuickbook = res.data.state === 'authorized' ? true : false;
            }, err => {}
        );
    }

    getCustomerContacts(customerId) {
        this.debitService.getCustomerContacts(customerId).subscribe(
            res => {
                try {
                    this.listMaster['contacts'] = res.data;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    getListOrder(customerId) {
        this.debitService.getListOrder(customerId).subscribe(
            res => {
                try {
                    this.listMaster['sale_orders'] = res.data;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    getListPaymentMethod() {
        this.debitService.getListPaymentMethods().subscribe(
            res => {
                try {
                    this.listMaster['payment_methods'] = res.data;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    getListPaymentTerms() {
        this.debitService.getListPaymentTerms().subscribe(
            res => {
                try {
                    this.listMaster['payment_terms'] = res.data;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    getListSalePerson() {
        this.debitService.getListSalePerson().subscribe(
            res => {
                try {
                    this.listMaster['sales_person'] = res.data;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    getListApprover() {
        this.debitService.getListApprovers().subscribe(
            res => {
                try {
                    this.listMaster['approvers'] = res.data;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    getOrderInformation(orderId) {
        this.debitService.getOrderInformation(orderId).subscribe(
            res => {
                try {
                    this.orderInformation.bill_info = res.data.bill_addr;
                    this.orderInformation.ship_info = res.data.ship_addr;
                    this.orderInformation.shipping_method = res.data.carrier;

                    this.debitMemoForm.controls.sale_person_id.setValue(res.data.sale_person_id);
                    this.debitMemoForm.controls.approver_id.setValue(res.data.approver_id);

                    this.debitMemoForm.controls.payment_method_id.setValue(res.data.payment_method_id);
                    this.debitMemoForm.controls.payment_term_id.setValue(res.data.payment_term_id);
                    if (res.data.payment_term_id !== null && res.data.payment_term_id !== undefined) {
                        this.onUpdateDueDate(res.data.payment_term_id);
                    }

                    this.debitMemoForm.controls.billing_id.setValue(res.data.bill_addr.id);
                    this.debitMemoForm.controls.shipping_id.setValue(res.data.ship_addr.id);
                    // this.debitMemoForm.controls.carrier_id.setValue(res.data.carrier.id);
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    getListBillOfCustomer(customerId) {
        this.debitService.getListBillOfCustomer(customerId).subscribe(
            res => {
                try {
                    this.listMaster['bill_labels'] = res.data;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    getListLineItems(orderId) {
        this.debitService.getListLineItems(orderId).subscribe(
            res => {
                try {
                    if (!this.listLineItems.length) {
                        if (this.isReSelectOrder) {
                            this.listLineItems = [...res.data.items, ...res.data.misc];
                        } else {
                            this.listDeletedLineItem = [...res.data.items, ...res.data.misc];
                        }
                        this.listLineItems.forEach(item => this.onCalculateAmount(item));
                    } else {
                        res.data.items.forEach(item => {
                            if (this.listLineItems.findIndex(lineItem => lineItem.item_id === item.item_id) >= 0) {
                                item.deleted = false;
                            } else {
                                item.deleted = true;
                                this.listDeletedLineItem.push(item);
                            }
                        });

                        res.data.misc.forEach(item => {
                            if (this.listLineItems.findIndex(lineItem => lineItem.misc_id === item.misc_id) >= 0) {
                                item.deleted = false;
                            } else {
                                item.deleted = true;
                                this.listDeletedLineItem.push(item);
                            }
                        });
                    }
                    this.getUniqueTaxItemLine();
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }
    //#endregion load master data

    //#region load Debit Detail
    getDebitDetail() {
        this.debitService.getDebitMemoDetail(this.debitId).subscribe(
            res => {
                try {
                    this.debitDetail = res.data;
                    this.debitMemoForm.patchValue(this.debitDetail);

                    // Lazy Load filter
                    const params = { page: this.data['page'], length: 100 };
                    this.debitService.getAllCustomer(params).subscribe(result => {
                        const idList = result.data.rows.map(item => item.id);
                        this.listMaster['customers'] = result.data.rows;
                        if (res.data.company_id && idList.indexOf(res.data.company_id) === -1) {
                            this.listMaster['customers'].push({ id: res.data.company_id, name: res.data.company_name, company_name: res.data.company_name });
                        }
                        this.data['total_page'] = result.data.total_page;
                    });

                    this.getUniqueTaxItemLine();

                    if (this.debitMemoForm.value.company_id !== null && this.debitMemoForm.value.company_id !== undefined) {
                        this.getCustomerContacts(this.debitMemoForm.value.company_id);
                        this.getListOrder(this.debitMemoForm.value.company_id);
                        this.getListBillOfCustomer(this.debitMemoForm.value.company_id);
                    }
                    if (this.debitMemoForm.value.order_id !== null && this.debitMemoForm.value.order_id !== undefined) {
                        this.listLineItems = this.debitDetail['line_items'];
                        this.orderInformation.bill_info = this.debitDetail['bill_addr'];
                        this.orderInformation.ship_info = this.debitDetail['ship_addr'];
                        this.orderInformation.shipping_method = this.debitDetail['carrier'];
                        // this.getOrderInformation(this.debitMemoForm.value.order_id);
                        this.getListLineItems(this.debitMemoForm.value.order_id);
                    }

                    if (this.debitDetail['contact_id'] !== null && this.debitDetail['contact_id'] !== undefined) {
                        this.contactDetail = {
                            phone: this.debitDetail['contact_phone'] || '',
                            email: this.debitDetail['contact_email'] || '',
                            disc_level: this.debitDetail['disc_level'] || '',
                        };
                    }
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }
    //#endregion load Debit Detail

    //#region handle onSelect/ onClick
    fetchMoreCustomer(data?) {
        this.data['page']++;
        if (this.data['page'] > this.data['total_page']) {
            return;
        }
        const params = { page: this.data['page'], length: 100 };
        if (this.data['searchKey']) {
            params['company_name'] = this.data['searchKey'];
        }
        this.debitService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customers'] = this.listMaster['customers'].concat(res.data.rows);
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
        this.debitService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customers'] = res.data.rows;
            this.data['total_page'] = res.data.total_page;
            this.refresh();
        });
    }

    onSelectCustomer() {
        this.contactDetail = {};
        this.listLineItems = [];
        this.listDeletedLineItem = [];
        this.listTaxs = [];
        this.debitMemoForm.patchValue({
            contact_id: null,
            order_id: null,

            payment_method_id: null,
            payment_term_id: null,
            due_date: null,
            sale_person_id: null,
            approver_id: null,

            billing_id: null,
            shipping_id: null,

            sub_total_price: 0,
            tax: 0,
            total_price: 0
        });
        this.getUniqueTaxItemLine();
        if (this.debitMemoForm.value.company_id !== null && this.debitMemoForm.value.company_id !== undefined) {
            this.getCustomerContacts(this.debitMemoForm.value.company_id);
            this.getListOrder(this.debitMemoForm.value.company_id);
            this.getListBillOfCustomer(this.debitMemoForm.value.company_id);
        } else {
            this.listMaster['contacts'] = [];
            this.listMaster['sale_orders'] = [];
            this.listMaster['bill_labels'] = [];
        }
        this.refresh();
    }

    onSelectContact(contactId) {
        this.contactDetail = this.listMaster['contacts'].find(cont => cont.id.toString() === contactId);
        this.refresh();
    }

    onSelectOrder() {
        const orderId = this.debitMemoForm.value.order_id;
        this.isReSelectOrder = true;
        this.listLineItems = [];
        this.listDeletedLineItem = [];
        this.listTaxs = [];
        this.debitMemoForm.patchValue({
            payment_method_id: null,
            payment_term_id: null,
            due_date: null,
            sale_person_id: null,
            approver_id: null,

            billing_id: null,
            shipping_id: null,

            sub_total_price: 0,
            tax: 0,
            total_price: 0
        });
        this.orderInformation.bill_info = {};
        this.orderInformation.ship_info = {};
        this.orderInformation.shipping_method = {};
        this.getUniqueTaxItemLine();
        if (orderId !== null && orderId !== undefined) {
            this.getOrderInformation(orderId);
            this.getListLineItems(orderId);
        } else {
            this.debitMemoForm.controls.order_id.setValue(null);
        }
        this.refresh();
    }

    onChangeIssueDate() {
        return (this.debitMemoForm.value.payment_term_id !== null && this.debitMemoForm.value.payment_term_id !== undefined)
            && this.onUpdateDueDate(this.debitMemoForm.value.payment_term_id);
    }

    onUpdateDueDate(termId) {
        const paymentTerm = this.listMaster['payment_terms'].find(term => term.id.toString() === termId.toString());
        const termDays = paymentTerm ? paymentTerm['term_day'] : 0;
        this.debitMemoForm.controls.due_date.setValue(
            moment(this.debitMemoForm.value.issue_date).add(termDays, 'days').format('YYYY-MM-DD')
        );
        this.refresh();
    }

    onChangeBillTo(billId) {
        this.orderInformation.bill_info = this.listMaster['bill_labels'].find(bill => bill.id.toString() === billId) || {};
        this.refresh();
    }

    onDeleteLineItem(deletedItem, index) {
        deletedItem.deleted = true;
        this.listDeletedLineItem.push(deletedItem);
        this.listLineItems.splice(index, 1);
        this.getUniqueTaxItemLine();
        this.refresh();
    }

    onCalculateAmount(item) {
        item['qty'] = item['qty'] ? parseInt(item['qty'], 0) : 0;
        item['price'] = parseFloat(item['price']) || 0;
        item['discount_percent'] = parseFloat(item['discount_percent']) || 0;
        item['tax_percent'] = parseFloat(item['tax_percent']) || 0;

        item['price'] = parseFloat(item['price'].toFixed(this.decimalAllowed));
        item['discount_percent'] = parseFloat(item['discount_percent'].toFixed(this.decimalAllowed));
        item['tax_percent'] = parseFloat(item['tax_percent'].toFixed(this.decimalAllowed));

        item['discount_percent'] = item['discount_percent'] < 100 ? item['discount_percent'] : 100;
        item['tax_percent'] = item['tax_percent'] < 100 ? item['tax_percent'] : 100;

        item['base_price'] = parseFloat((item['qty'] * item['price']).toFixed(this.decimalAllowed) || '0');

        item['discount'] = parseFloat((item['base_price'] / 100 * item['discount_percent']).toFixed(this.decimalAllowed) || '0');
        item['total_price'] = parseFloat((item['base_price'] - item['discount']).toFixed(this.decimalAllowed) || '0');
        item['tax'] = parseFloat((item['total_price'] / 100 * item['tax_percent']).toFixed(this.decimalAllowed) || '0');
        this.refresh();
    }

    onAddNote() {
        this.renderer.invokeElementMethod(this.noteText.nativeElement, 'focus');
    }

    openModalAddItemsOrder() {
        const modalRef = this.modalService.open(ItemsOrderDebitModalContent, {
            size: 'lg'
        });
        const params = {
            orderId: this.debitMemoForm.value.order_id,
            items: this.listDeletedLineItem.filter(item => item.order_detail_id !== undefined && item.order_detail_id !== null).map(item => item.order_detail_id)
        };
        modalRef.componentInstance.setIgnoredItems = params;
        modalRef.result.then(res => {
            if (res) {
                res.forEach(selectedItem => {
                    const itemIndex = this.listDeletedLineItem.findIndex(item => item.order_detail_id === selectedItem.order_detail_id);
                    if (itemIndex >= 0) {
                        this.listDeletedLineItem.splice(itemIndex, 1);
                    }
                    this.listLineItems.push(selectedItem);
                });
                this.getUniqueTaxItemLine();
            }
        }, dismiss => { });
    }

    openModalAddMiscItems() {
        const modalRef = this.modalService.open(MiscItemsDebitModalContent, {
            size: 'lg'
        });
        const params = {
            orderId: this.debitMemoForm.value.order_id,
            items: this.listLineItems.filter(item => item.misc_id !== undefined && item.misc_id !== null).map(item => item.misc_id)
        };
        modalRef.componentInstance.setIgnoredItems = params;
        modalRef.result.then(res => {
            if (res) {
                res.forEach(selectedItem => {
                    const itemIndex = this.listDeletedLineItem.findIndex(item => item.misc_id === selectedItem.misc_id);
                    if (itemIndex >= 0) {
                        this.listDeletedLineItem.splice(itemIndex, 1);
                    }
                    this.listLineItems.push(selectedItem);
                });
                this.getUniqueTaxItemLine();
            }
        }, dismiss => { });
    }

    onClickSave(saveMethod) {
        let modalMessage = '';
        let status = 1;
        this.isClickedSave = true;
        switch (saveMethod) {
            case 'draft': {// Save as Draft
                this.isSaveDraft = true;
                this.isCreateNew = false;
                this.onSaveDebitMemo(status);
                break;
            }
            case 'create': {// Create New
                this.isSaveDraft = false;
                this.isCreateNew = true;
                this.onSaveDebitMemo(status);
                break;
            }
            case 'submit': {// Save & Submit
                this.isSaveDraft = false;
                this.isCreateNew = false;
                status = 2;
                modalMessage = 'Are you sure that you want to save & submit the debit memo to approver?';
                break;
            }
            case 'validate': {// Save & Validate
                this.isSaveDraft = false;
                this.isCreateNew = false;
                status = 3;
                modalMessage = 'Are you sure that you want to Save & Validate the debit memo?';
                break;
            }
        }
        if (status !== 1) {
            const modalRef = this.modalService.open(ConfirmModalContent);
            modalRef.componentInstance.message = modalMessage;
            modalRef.componentInstance.yesButtonText = 'YES';
            modalRef.componentInstance.noButtonText = 'NO';
            modalRef.result.then(yes => {
                if (yes && this.validateData() && this.validateItemData() && this.listLineItems.length) {
                    this.onSaveDebitMemo(status);
                } else if (!this.listLineItems.length) {
                    this.toastr.error('Please select at least 1 item to continue.');
                } else if (!this.validateItemData()) {
                    this.toastr.error('Item is invalid.');
                }
            }, dismiss => { });
        }
        this.refresh();
    }

    onClickBack() {
        const modalRef = this.modalService.open(ConfirmModalContent);
        modalRef.componentInstance.message = 'The data you have entered may not be saved, are you sure that you want to leave?';
        modalRef.componentInstance.yesButtonText = 'YES';
        modalRef.componentInstance.noButtonText = 'NO';
        modalRef.result.then(yes => {
            if (yes) {
                window.history.back();
            }
        }, dismiss => { });
    }
    //#endregion handle onSelect/ onClick

    //#region call api submit
    onSaveDebitMemo(status) {
        const params = { ...this.debitMemoForm.value };
        params['sts'] = status;
        params['line_items'] = this.listLineItems;

        params['approver_id'] = status === 3 ? this.currentUser['id'] : parseInt(params['approver_id'], null);
        params['billing_id'] = parseInt(params['billing_id'], null);
        params['contact_id'] = parseInt(params['contact_id'], null);
        params['doc_type'] = parseInt(params['doc_type'], null);
        params['order_id'] = parseInt(params['order_id'], null);
        params['payment_method_id'] = parseInt(params['payment_method_id'], null);
        params['payment_term_id'] = parseInt(params['payment_term_id'], null);

        this.debitService.updateDebitMemo(this.debitId, params).subscribe(
            res => {
                try {
                    this.toastr.success(res.message);
                    if ( status === 3 && this.isInstallQuickbook) {
                        this.financialService.syncDebitToQuickbook(this.debitId).subscribe(
                            _res => {
                                try {
                                    const result = JSON.parse(_res['_body']);
                                    this.toastr.success(`Debit Memo ${result.data[0].entity.DocNumber} has been sync to Quickbooks successfully.`);
                                } catch (err) {}
                            },
                            err => {
                                this.toastr.error(`Cannot sync Debit Memo to Quickbooks.`);
                            }
                        );
                    }
                    this.handleSaveSuccessfully(status, this.debitId);
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }
    //#endregion call api submit

    //#region utility functions
    getUniqueTaxItemLine() {
        if (this.listLineItems.length) {
            this.listTaxs = _.uniq(this.listLineItems.map(item => parseFloat(item.tax_percent)))
                .map(item => {
                    return { tax_percent: item, amount: 0 };
                });

            let total_tax = 0;
            this.listTaxs.forEach(taxItem => {
                let sub_price = 0;
                this.listLineItems.forEach(item => {
                    taxItem.amount += (parseFloat(item.tax_percent) === taxItem.tax_percent) ? parseFloat(item.tax.toFixed(this.decimalAllowed)) : 0;
                    taxItem.amount = parseFloat(taxItem.amount.toFixed(this.decimalAllowed));
                    sub_price += item.total_price;
                });
                total_tax += taxItem.amount;
                this.debitMemoForm.controls.sub_total_price.setValue(parseFloat(sub_price.toFixed(this.decimalAllowed)));
            });
            this.debitMemoForm.controls.tax.setValue(parseFloat(total_tax.toFixed(this.decimalAllowed)));
            this.debitMemoForm.controls.total_price.setValue(parseFloat((this.debitMemoForm.value.sub_total_price + total_tax).toFixed(this.decimalAllowed)));
        } else {
            this.debitMemoForm.controls.sub_total_price.setValue(0);
            this.debitMemoForm.controls.tax.setValue(0);
            this.debitMemoForm.controls.total_price.setValue(0);
        }
        this.refresh();
    }

    handleSaveSuccessfully(status, debitId) {
        if (status === 1) {
            this.isCreateNew ? window.location.reload() : this.router.navigate(['/financial/debit-memo/view', debitId]);
        } else {
            this.router.navigate(['/financial/debit-memo/view', debitId]);
        }
    }

    validateData() {
        return this.debitMemoForm.valid;
    }

    validateItemData() {
        let isValidate = true;
        this.listLineItems.forEach(item => {
            if (!item.qty) {
                isValidate = false;
            }
        });
        return isValidate;
    }
    //#endregion utility functions
}
