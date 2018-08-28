import { Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../../services/table.service';

import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';

import { DebitMemoCreateKeyService } from './keys.create.control';

import { ItemsOrderDebitModalContent } from '../modals/items-order/items-order.modal';
import { MiscItemsDebitModalContent } from '../modals/misc-items/misc-items.modal';

import { DebitMemoService } from '../debit-memo.service';

import * as moment from 'moment';
@Component({
    selector: 'app-debit-memo-create',
    templateUrl: './debit-memo-create.component.html',
    styleUrls: ['./debit-memo-create.component.scss'],
    animations: [routerTransition()],
    providers: [DebitMemoCreateKeyService]
})
export class DebitMemoCreateComponent implements OnInit {

    //#region initialize variables
    public listMaster = {
        customers : [],
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
    public todayDate = moment().format('YYYY-MM-DD');
    public payment_term_date = 0;

    public debitMemoForm: FormGroup;
    //#endregion initialize variables

    //#region contructor
    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        private modalService: NgbModal,
        public keyService: DebitMemoCreateKeyService,
        public tableService: TableService,
        public debitService: DebitMemoService,
        private renderer: Renderer) {

        this.debitMemoForm = fb.group({
            customer_id: [null, Validators.required],
            contact: [null],

            debt_no: [null, Validators.required],
            issue_date: [null, Validators.required],
            doc_type: [null, Validators.required],
            order_id: [null, Validators.required],
            sts: [1],

            payment_method_id: [null, Validators.required],
            payment_term_id: [null, Validators.required],
            due_date: [null, Validators.required],
            sale_person_id: [null, Validators.required],
            approver_id: [null, Validators.required],

            billing_id: [null, Validators.required],

            note: [null]
        });

        this.listMaster['document_types'] = [
            {
                id: 1,
                name: 'Sales Order'
            }
        ];
        //  Init hot keys
        this.keyService.watchContext.next(this);
    }
    //#endregion constructor

    //#region lifecycle hook
    ngOnInit() {
        this.getListCustomer('');
        this.getDebitMemoNo();
        this.getListPaymentMethod();
        this.getListPaymentTerms();
        this.getListSalePerson();
        this.getListApprover();

        this.debitMemoForm.controls.issue_date.setValue(this.todayDate);
    }
    //#endregion lifecycle hook

    //#region load master data
    getListCustomer(keySearch) {
        this.debitService.getListCustomer(keySearch).subscribe(
            res => {
                try {
                    this.listMaster['customers'] = res.data;
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    getDebitMemoNo() {
        this.debitService.getDebitMemoNoAuto().subscribe(
            res => {
                try {
                    this.debitMemoForm.controls.debt_no.setValue(res.message);
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    getCustomerContacts(customerId) {
        this.debitService.getCustomerContacts(customerId).subscribe(
            res => {
                try {
                    this.listMaster['contacts'] = res.data;
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
                    this.orderInformation.shipping_method = res.data.shipping_method;

                    this.debitMemoForm.controls.sale_person.setValue(res.data.sale_person_id);
                    this.debitMemoForm.controls.approver.setValue(res.data.approver_id);
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
                    console.log(res);
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
                    this.listLineItems = res.data.items;
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }
    //#endregion load master data

    //#region handle onSelect/ onClick
    onSelectCustomer() {
        if (this.debitMemoForm.value.customer_id) {
            this.getCustomerContacts(this.debitMemoForm.value.customer_id);
            this.getListOrder(this.debitMemoForm.value.customer_id);
            this.getListBillOfCustomer(this.debitMemoForm.value.customer_id);
        }
    }

    onSelectContact(contactId) {
        this.contactDetail = this.listMaster['contacts'].find(cont => cont.id.toString() === contactId);
    }

    onSelectOrder(orderId) {
        this.getOrderInformation(orderId);
        this.getListLineItems(orderId);
    }

    onUpdateDueDate(termId) {
        const termDays = this.listMaster['payment_terms'].find(term => term.id.toString() === termId)['term_day'] || 0;
        this.debitMemoForm.controls.due_date.setValue(
            moment(this.debitMemoForm.value.issue_date).add(termDays, 'days').format('YYYY-MM-DD')
        );
    }

    openModalAddItemsOrder() {
        const modalRef = this.modalService.open(ItemsOrderDebitModalContent, {
            size: 'lg'
        });
        modalRef.result.then(res => {
        }, dismiss => {});
    }

    openModalAddMiscItems() {
        const modalRef = this.modalService.open(MiscItemsDebitModalContent, {
            size: 'lg'
        });
        modalRef.result.then(res => {
        }, dismiss => {});
    }

    onClickSave(type) {
        switch (type) {
            case 'draft': {
                console.log('draft', this.debitMemoForm.value);
                break;
            }
            case 'submit': {
                console.log('submit', this.debitMemoForm.value);
                break;
            }
            case 'validate': {
                console.log('validate', this.debitMemoForm.value);
                break;
            }
            case 'create': {
                console.log('create', this.debitMemoForm.value);
                break;
            }
        }
    }

    onClickBack() {
        window.history.back();
    }
    //#endregion handle onSelect/ onClick

    //#region call api submit
    //#endregion call api submit

    //#region utility functions
    validateData() {
        return this.debitMemoForm.invalid;
    }
    //#endregion utility functions
}
