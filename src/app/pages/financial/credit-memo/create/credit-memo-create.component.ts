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
import { CreditMemoCreateKeyService } from './keys.create.control';

import { HotkeysService } from 'angular2-hotkeys';
import * as _ from 'lodash';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';
import { CreditMemoService } from './../credit-memo.service';


@Component({
    selector: 'app-create-credit-memo',
    templateUrl: './credit-memo-create.component.html',
    styleUrls: ['../credit-memo.component.scss'],
    providers: [OrderService, HotkeysService, CreditMemoCreateKeyService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
    animations: [routerTransition()]
})

export class CreditMemoCreateComponent implements OnInit {
    /**
     * Variable Declaration
     */

    public generalForm: FormGroup;
    public listMaster = {};
    public selectedIndex = 0;
    public data = {};

    public messageConfig = {
        '2': 'Are you sure that you want to save & submit this quotation to approver?',
        '4': 'Are you sure that you want to validate this quotation?',
        'default': 'The data you have entered may not be saved, are you sure that you want to leave?',
    };

    public customer: any = {
        'last_sales_order': '',
        'current_dept': '',
        'discount_level': '',
        'items_in_quote': '',
        'buyer_type': '',
        primary: [],
        billing: [],
        shipping: [],
        contact: []
    };

    public addr_select: any = {
        shipping: {},
        billing: {},
        contact: {}
    };

    public order_info: any = {
        total: 0,
        order_summary: {},
        sub_total: 0,
        order_date: '',
        customer_po: '',
        total_discount: 0,
        company_id: null,
        selected_programs: [],
        discount_percent: 0,
        vat_percent: 0,
        shipping_cost: 0
    };

    public list = {
        items: [],
        backItems: []
    };

    public searchKey = new Subject<any>(); // Lazy load filter

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
        public keyService: CreditMemoCreateKeyService,
        private creditMemoService: CreditMemoService,
        private dt: DatePipe) {
        this.generalForm = fb.group({
            'approver_id': [null, Validators.required],
            'company_id': [null, Validators.required],
            'carrier_id': [null], // Default Ups
            'ship_rate': [null],
            'ship_method_option': [null],
            'warehouse_id': [null],
            'contact_user_id': [null],
            'sales_person': [null, Validators.required],
            'payment_method_id': [null, Validators.required],
            'payment_term_id': [null, Validators.required],
            'billing_id': [null],
            'shipping_id': [null],
            'note': [null],
            'apply_late_fee': [null],
            'due_dt': [null, Validators.required],
            'payment_term_range': [null],

            // Invoice
            'inv_dt': [null, Validators.required],
            'inv_num': [null, Validators.required],
            'order_id': [null, Validators.required],
        });
        //  Init Key
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    async ngOnInit() {
        this.data['id'] = this.route.snapshot.queryParams['quote_id'];
        this.data['is_copy'] = this.route.snapshot.queryParams['is_copy'] || 0;

        const user = JSON.parse(localStorage.getItem('currentUser'));

        // List Master
        this.orderService.getOrderReference().subscribe(res => { Object.assign(this.listMaster, res.data); });
        await this.getListPaymentMethod();
        await this.getListPaymentTerm();
        await this.getListAccountGL();
        this.getGenerateCode();
        this.listMaster['yes_no_options'] = [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }];

        //  Item
        this.list.items = [];
        const currentDt = new Date();

        // Init Date
        this.generalForm.controls['inv_dt'].patchValue(currentDt.toISOString().slice(0, 10));

        // Invoice
        this.generalForm.controls['inv_dt'].valueChanges.debounceTime(300).subscribe(data => {
            if (!this.generalForm.value['payment_term_id']) { return; }
            this.generalForm.controls['payment_term_range'].setValue(this.getPaymentTermRange(this.generalForm.value['payment_term_id']));
            this.getInvoiceDueDate(this.generalForm.value['payment_term_range']);
            this.getEarlyPaymentValue();
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
    }

    /**
     * Mater Data
     */
    getListPaymentMethod() {
        return new Promise(resolve => {
            this.creditMemoService.getPaymentMethod().subscribe(res => {
                this.listMaster['payment_method'] = res.data;
                resolve(true);
            });
        });
    }

    getListPaymentTerm() {
        return new Promise(resolve => {
            this.creditMemoService.getListPaymentTerm().subscribe(res => {
                this.listMaster['payment_term'] = res.data;
                resolve(true);
            });
        });
    }

    getListAccountGL() {
        return new Promise(resolve => {
            this.creditMemoService.getListAccountGL().subscribe(res => {
                this.listMaster['accountGL'] = res.data;
                resolve(true);
            });
        });
    }

    getOrderByCustomerId(company_id) {
        const params = {
            cus_id: company_id
        };
        this.creditMemoService.getOrderByCustomerId(params).subscribe(res => {
            try {
                this.listMaster['sales_order'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getGenerateCode() {
        this.creditMemoService.getGenerateCode().subscribe(res => {
            this.generalForm.get('inv_num').patchValue(res.data.code);
        });
    }

    getEarlyPaymentValue() {
        const issue_dt = this.generalForm.get('inv_dt').value;
        const payment_term_id = this.generalForm.get('payment_term_id').value;
        const total_due = this.order_info['total'];
        if (issue_dt && payment_term_id && total_due) {
            this.creditMemoService.getEarlyPaymentValue(issue_dt, payment_term_id, total_due).subscribe(res => {
                if (res.data) {
                    this.data['is_fixed_early'] = res.data.is_fixed;
                    this.order_info.incentive_percent = res.data.percent;
                    this.order_info.incentive = res.data.value;
                    this.order_info.expires_dt = res.data.expires_dt;
                    this.order_info.grand_total = this.order_info.total - this.order_info.incentive;
                }
            });
        }
    }

    getPaymentTermRange(id) {
        const paymentTerm = (this.listMaster['payment_term'] || []).find(item => item.id === id);
        return paymentTerm.term_day;
    }

    changePaymentTerms() {
        const listPaymentTerms = this.listMaster['payment_terms'];
        for (const unit of listPaymentTerms) {
            if (unit.id === this.generalForm.value['payment_term_id']) {
                this.generalForm.controls['payment_term_range'].setValue(unit.term_day);
                this.getInvoiceDueDate(this.generalForm.value['payment_term_range']);
            }
        }
    }

    getInvoiceDueDate(paymentTermDayLimit) {
        const params = {
            issue_dt: this.generalForm.value['inv_dt'],
            payment_term_dt: paymentTermDayLimit
        };
        this.creditMemoService.getInvoiceDueDate(params).subscribe(res => {
            try {
                if (params['payment_term_dt'] && res.data.due_dt) {
                    this.generalForm.controls['due_dt'].setValue(this.dt.transform(new Date(res.data.due_dt), 'MM/dd/yyyy'));
                }
            } catch (e) {
                console.log(e);
            }
        });
    }

    getDetailCustomerById(company_id, flag?) {
        this.orderService.getDetailCompany(company_id).subscribe(res => {
            try {
                this.customer = res.data;
                if (res.data.buyer_type === 'PS') {
                    this.addr_select.contact = res.data.contact[0];
                    this.generalForm.patchValue({ contact_user_id: res.data.contact[0]['id'] });
                }
                if (flag) {
                    this.selectAddress('billing', flag);
                    this.selectAddress('shipping', flag);
                }
            } catch (e) {
                console.log(e);
            }
        });
    }

    /**
     * Internal Function
     */
    selectData(data) { }

    changeSalesOrder(event) {
        this.list.items = event.detail.map(item => {
            item.qty_inv = item.qty;
            return item;
        });

        this.data['order_detail'] = { ...event.order, sale_person_name: event.sale_person_name };
        this.data['shipping_address'] = event.shipping_address;
        this.data['shipping_method'] = event.shipping_method;

        this.generalForm.patchValue({
            ...this.data['order_detail'], inv_dt: this.generalForm.value.inv_dt,
        });
        this.selectAddress('billing');
        this.updateTotal();
    }

    changeCustomer(flag?) {
        const company_id = this.generalForm.value.company_id;
        if (company_id) {
            this.getDetailCustomerById(company_id, flag);
            this.getOrderByCustomerId(company_id);
        }

        if (!flag) {
            this.list.items = [];
            this.updateTotal();
        }
    }

    selectAddress(type, flag?) {
        try {
            switch (type) {
                case 'shipping':
                    const ship_id = this.generalForm.value.shipping_id;
                    if (ship_id) {
                        this.addr_select.shipping = this.findDataById(ship_id, this.customer.shipping);
                    }
                    break;
                case 'billing':
                    const billing_id = this.generalForm.value.billing_id;
                    if (billing_id) {
                        this.addr_select.billing = this.findDataById(billing_id, this.customer.billing);
                    }
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    }

    findDataById(id, arr) {
        const item = arr.filter(x => x.address_id === id);
        return item[0];
    }

    selectContact() {
        const id = this.generalForm.value.contact_user_id;
        if (id) {
            const temp = this.customer.contact.filter(x => x.id === id);
            this.addr_select.contact = temp[0];
        }
    }


    updateTotal() {
        this.order_info.total = 0;
        this.order_info.sub_total = 0;

        const items = this.list.items.filter(i => !i.misc_id);
        this.groupTax(this.list.items);
        this.order_info.order_summary = {};
        this.order_info.order_summary['total_item'] = items.length;
        items.forEach(item => {
            this.order_info.order_summary['total_cogs'] = (this.order_info.order_summary['total_cogs'] || 0) + (+item.cost_price || 0) * (item.quantity || 0);
            this.order_info.order_summary['total_vol'] = (this.order_info.order_summary['total_vol'] || 0) + (+item.vol || 0) * (item.quantity || 0);
            this.order_info.order_summary['total_weight'] = (this.order_info.order_summary['total_weight'] || 0) + (+item.wt || 0) * (item.quantity || 0);
        });


        this.list.items.forEach(item => {
            item.amount = (+item.qty_inv * (+item.price || 0)) * (100 - (+item.discount_percent || 0)) / 100;
            this.order_info.sub_total += item.amount;
        });
        this.order_info.total = +this.order_info['total_tax'] + +this.order_info.sub_total;
        if (this.order_info.incentive_percent) {
            this.order_info.incentive = +this.order_info.incentive_percent * +this.order_info.total / 100;
            this.order_info.grand_total = +this.order_info.total - +this.order_info.incentive;
        }
    }

    deleteAction(id, item_condition) {
        this.list.items = this.list.items.filter((item) => {
            return (item.item_id + (item.item_condition_id || 'mis') !== (id + (item.item_condition_id || 'mis')));
        });
        this.updateTotal();
    }

    groupTax(items) {
        this.order_info['taxs'] = [];
        this.order_info['total_tax'] = 0;
        const taxs = items.map(item => item.tax_percent || 0);
        const unique = taxs.filter((i, index) => taxs.indexOf(i) === index);
        unique.forEach((tax, index) => {
            let taxAmount = 0;
            items.filter(item => item.tax_percent === tax).map(i => {
                taxAmount += (+i.tax_percent * +i.qty_inv * (+i.price || 0) / 100);
            });
            this.order_info['total_tax'] = this.order_info['total_tax'] + +(taxAmount.toFixed(2));
            this.order_info['taxs'].push({
                value: tax, amount: taxAmount.toFixed(2)
            });
        });
    }

    resetInvoice() {
        this.listMaster = {};
        this.data = {};
        this.customer = {
            'last_sales_order': '',
            'current_dept': '',
            'discount_level': '',
            'items_in_quote': '',
            'buyer_type': '',
            primary: [],
            billing: [],
            shipping: [],
            contact: []
        };

        this.addr_select = {
            shipping: {},
            billing: {},
            contact: {}
        };

        this.order_info = {
            total: 0,
            order_summary: {},
            sub_total: 0,
            order_date: '',
            customer_po: '',
            total_discount: 0,
            company_id: null,
            selected_programs: [],
            discount_percent: 0,
            vat_percent: 0,
            shipping_cost: 0
        };

        this.list = {
            items: [],
            backItems: []
        };
        this.ngOnInit();
    }

    createInvoice(type, is_draft_sq?) {
        const items = this.list.items.map(item => {
            item.discount_percent = item.discount;
            item.is_item = (item.misc_id) ? 0 : 1;
            return item;
        });

        const params = {
            ...this.generalForm.value,
            status_id: type,
            original_ship_cost: this.order_info['original_ship_cost'],
            items,
            is_draft_sq: is_draft_sq || 0,
            is_copy: this.data['is_copy'] || 0
        };

        this.creditMemoService.createInvoice(params).subscribe(res => {
            try {
                if (res.status) {
                    this.toastr.success(res.message);
                    this.data['invoice_id'] = res.data;
                    setTimeout(() => {
                        this.router.navigate(['/financial/invoice/detail/' + this.data['invoice_id']]);
                    }, 500);

                } else {
                    this.toastr.error(res.message);
                }
            } catch (e) {
                console.log(e);
            }
        });
    }

    confirmModal(type, is_draft_sq?) {
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                if (type) {
                    this.createInvoice(type, is_draft_sq);
                } else {
                    this.router.navigate(['/financial/invoice']);
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
