import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { FinancialService } from '../financial.service';

import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { ItemModalContent } from '../../../shared/modals/item.modal';
import { OrderHistoryModalContent } from '../../../shared/modals/order-history.modal';
import { OrderSaleQuoteModalContent } from '../../../shared/modals/order-salequote.modal';
import { PromotionModalContent } from '../../../shared/modals/promotion.modal';
import { CommonService } from './../../../services/common.service';
import { InvoiceCreateKeyService } from './keys.create.control';

@Component({
    selector: 'app-invoice-create',
    templateUrl: './invoice.create.component.html',
    styleUrls: ['./invoice.component.scss'],
    animations: [routerTransition()],
    providers: [DatePipe, InvoiceCreateKeyService, CommonService]
})

export class InvoiceCreateComponent implements OnInit {
    /**
     * Variable Declaration
     */
    public generalForm: FormGroup;
    public listMaster = {};
    public selectedIndex = 0;
    public data = {};
    public customer = {
        'last_sales_order': '',
        'current_dept': '',
        'discount_level': '',
        'items_in_quote': '',
        'buyer_type': '',
        primary: [{
            'address_line': '',
            'city_name': '',
            'state_name': '',
            'zip_code': '',
            'country_name': ''
        }],
        billing: [],
        shipping: [],
        contact: []
    };

    public addr_select = {
        shipping: {
            'address_name': '',
            'address_line': '',
            'country_name': '',
            'city_name': '',
            'state_name': '',
            'zip_code': ''
        },
        billing: {
            'address_name': '',
            'address_line': '',
            'country_name': '',
            'city_name': '',
            'state_name': '',
            'zip_code': ''
        },
        contact: {
            'phone': '',
            'email': ''
        }
    };

    public order_info = {
        total: 0,
        sub_total: 0,
        order_date: '',
        customer_po: '',
        total_discount: 0,
        company_id: null,
        selected_programs: [],
        discount_percent: 0,
        vat_percent: 0,
        shipping_cost: 0,
        expires_dt: ''
    };

    public list = {
        items: [],
        backItems: []
    };
    public payment;
    public headerTitle;
    public invoiceId;
    public promotionList = {};
    public copy_customer = {};
    public copy_addr = {};
    public list_sales_order = [];
    public invoice_details = {};
    public order_details = {};
    public isCreate = false;
    public isEdit = false;
    public applyEPI;
    public applyLFP;
    public show_early = true;

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
        private financialService: FinancialService,
        public keyService: InvoiceCreateKeyService,
        private commonService: CommonService,
        private dt: DatePipe) {
        this.generalForm = fb.group({
            'id': [null],
            'invoice_status_name': [null],
            'inv_type': [1],
            'inv_status': [null],
            'ear_payment_incentive': [null],
            'apply_late_fee': [null],
            'inv_num': [null, Validators.required],
            'company_id': [null, Validators.required],
            'billing_address_id': [null, Validators.required],
            'order_id': [null, Validators.required],
            'order_num': [null, Validators.required],
            'note': [null],
            'inv_dt': [null, Validators.required],
            'payment_method_id': [null, Validators.required],
            'due_dt': [null, Validators.required],
            'payment_term_id': [null, Validators.required],
            'aprvr_id': [null, Validators.required],
            'payment_term_range': [null],
            'shipping_cost': [null],
            'sub_total': [null],
            'discount_percent': [null],
            'tax_percent': [null],
            'total_due': [null],
            'discount_amount': [null],
            'tax_amount': [null],
            'address': [null],
            'order_detail': [null]
        });
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        const path = window.location.pathname;
        this.route.params.subscribe(params => {
            if (params.id) {
                this.isCreate = false;
                this.isEdit = true;
                this.invoiceId = params.id;
                this.getDetailInvoice(this.invoiceId);
                this.keyService.watchContext.next(this);
            } else {
                this.isCreate = true;
                this.isEdit = false;
                this.headerTitle = 'CREATE NEW INVOICE';
                const currentDt = this.dt.transform(new Date(), 'yyyy-MM-dd');
                this.generalForm.controls['inv_dt'].patchValue(currentDt);
                this.generalForm.controls['inv_status'].setValue(1);
                this.getGenerateCode();
            }
        });
        this.listMaster['yes_no_options'] = [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }];
        this.listMaster['payment_method'] = [
            { id: 1, name: 'Bank Transfer' },
            { id: 2, name: 'Cash on Delivery' },
            { id: 3, name: 'Credit Card' }
        ];
        this.getListCustomerOption();
        this.getListApprover();
        this.getListPaymentTerm();
        this.updateTotal();
        this.copy_addr = { ...this.copy_addr, ...this.addr_select };
        this.copy_customer = { ...this.copy_customer, ...this.customer };
        this.generalForm.controls['inv_dt'].valueChanges.debounceTime(300).subscribe(data => {
            this.getInvoiceDueDate(this.generalForm.value['payment_term_range']);
        });
    }

    getListCustomerOption() {
        this.financialService.getAllCustomer().subscribe(res => {
            try {
                this.listMaster['customer'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getListApprover() {
        this.financialService.getListApprover().subscribe(res => {
            try {
                this.listMaster['approver'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getDetailInvoice(id) {
        if (id) {
            this.financialService.getDetailInvoice(id).subscribe(res => {
                this.invoice_details = res.data;
                this.generalForm.patchValue(this.invoice_details);
                this.generalForm.patchValue({
                    billing_address_id: this.invoice_details['billing_id'],
                    inv_status: this.invoice_details['invoice_status_id'],
                    inv_dt: this.dt.transform(new Date(res.data.inv_dt), 'yyyy-MM-dd')
                });
                if (res.data.company_id) {
                    this.getDetailCustomerById(res.data.company_id);
                    if (this.isCreate) {
                        this.getOrderByCustomerId(res.data.company_id);
                    }
                    if (this.isEdit) {
                        this.list.items = this.transformInvoiceDetailsItems(this.invoice_details['items']);
                        const orderId = this.invoice_details['orders'][0]['id'];
                        const orderNum = this.invoice_details['orders'][0]['code'];
                        this.generalForm.patchValue({
                            order_id: this.invoice_details['orders'][0]['id'],
                            order_num: this.invoice_details['orders'][0]['code'],
                            shipping_cost: this.invoice_details['shp_cost'],
                            sub_total: this.invoice_details['sub_tot'],
                            discount_percent: this.invoice_details['dsct_pct'],
                            tax_percent: this.invoice_details['tax_pct'],
                            total_due: this.invoice_details['tot_amt'],
                            discount_amount: this.invoice_details['dsct_amt'],
                            tax_amount: this.invoice_details['tax_amt']
                        });
                    }
                }
                if (!this.generalForm.value['payment_term_range']) {
                    this.generalForm.controls['payment_term_range'].setValue(this.getPaymentTermRange(this.generalForm.value['payment_term_id']));
                }
                this.headerTitle = this.generalForm.value['inv_num'];
            }, err => {
                console.log(err.message);
            });
        }
    }

    getDetailCustomerById(company_id) {
        this.financialService.getDetailCompany(company_id).subscribe(res => {
            try {
                this.customer = res.data;
                this.addr_select.shipping = this.customer.shipping[0] ? this.customer.shipping[0] : {};
                if (this.isCreate) {
                    this.addr_select.billing = this.customer.billing[0] ? this.customer.billing[0] : {};
                    this.generalForm.controls['billing_address_id'].setValue(this.customer.billing[0].address_id);
                } else {
                    this.addr_select.billing = this.findDataById(this.invoice_details['address'].billing[0].id, this.customer.billing);
                }
            } catch (e) {
                console.log(e);
            }
        });
    }
    getEarlyPaymentValue() {
        const issue_dt = this.generalForm.get('inv_dt').value;
        const payment_term_id = this.generalForm.get('payment_term_id').value;
        const total_due = this.generalForm.get('total_due').value;
        this.financialService.getEarlyPaymentValue(issue_dt, payment_term_id, total_due).subscribe(res => {
            if (res.data) {
                this.order_info.discount_percent = res.data.percent;
                this.order_info.total_discount = res.data.value;
                this.order_info.expires_dt = res.data.expires_dt;
            } else {
                this.show_early = false;
            }
        });
    }

    getOrderByCustomerId(company_id) {
        this.list_sales_order = [];
        const params = {
            cus_id: company_id
        };
        this.financialService.getOrderByCustomerId(params).subscribe(res => {
            try {
                this.list_sales_order = res.data;
                if (res.data.length > 0) {
                    this.list.items = res.data[0].detail;
                    this.order_details = res.data[0].order;
                    const orderId = this.order_details['id'];
                    const orderNum = this.order_details['code'];
                    const orderCreatorId = this.order_details['created_by'];
                    this.generalForm.patchValue({
                        order_id: orderId,
                        order_num: orderNum,
                        shipping_cost: this.order_details['shipping'],
                        sub_total: this.order_details['sub_total_price'],
                        discount_percent: this.order_details['discount_percent'],
                        tax_percent: this.order_details['vat_percent'],
                        total_due: this.order_details['total_price'],
                        discount_amount: this.order_details['discount'],
                        tax_amount: this.order_details['vat']
                    });
                    if (!this.generalForm.value['aprvr_id']) {
                        this.generalForm.controls['aprvr_id'].setValue(orderCreatorId);
                    }
                } else {
                    this.list.items = [];
                    this.order_details = {};
                }
            } catch (e) {
                console.log(e);
            }
        });
    }

    getListPaymentTerm() {
        this.financialService.getListPaymentTerm().subscribe(res => {
            try {
                this.listMaster['payment_terms'] = res.data.rows;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getPaymentTermRange(id) {
        setTimeout(() => {
            const paymentTerm = this.listMaster['payment_terms'].find(item => item.id === id);
            return paymentTerm.term_day;
        }, 1000);
    }

    /**
     * Internal Function
     */
    selectData(data) { }

    changeCustomer(event) {
        const company_id = this.generalForm.value.company_id;
        this.customer = Object.create(this.copy_customer);
        this.addr_select = Object.create(this.copy_addr);
        if (company_id) {
            this.getDetailCustomerById(company_id);
            this.getOrderByCustomerId(company_id);
        }
        this.generalForm.controls['note'].patchValue('');
        this.updateTotal();
        if (event && event.invoice_EIP.flg_invoice_EIP) {
            this.generalForm.controls['ear_payment_incentive'].setValue(1);
        } else {
            this.generalForm.controls['ear_payment_incentive'].setValue(0);
        }
        if (event && event.invoice_LFP.flg_invoice_LFP) {
            this.generalForm.controls['apply_late_fee'].setValue(1);
        } else {
            this.generalForm.controls['apply_late_fee'].setValue(0);
        }
        if (!event) {
            this.generalForm.controls['order_id'].setValue(null);
            this.generalForm.controls['aprvr_id'].setValue(null);
            this.generalForm.controls['ear_payment_incentive'].setValue(null);
            this.generalForm.controls['apply_late_fee'].setValue(null);
            this.list_sales_order = [];
            this.list.items = [];
        }
    }

    changeSalesOrder(event) {
        if (event) {
            this.list.items = event.detail;
            this.order_details = event.order;
        } else {
            this.list.items = [];
            this.order_details = {};
        }
        const orderId = this.order_details['id'];
        const orderNum = this.order_details['code'];
        const orderCreatorId = this.order_details['created_by'];
        this.generalForm.patchValue({
            order_id: orderId,
            order_num: orderNum,
            shipping_cost: this.order_details['shipping'],
            sub_total: this.order_details['sub_total_price'],
            discount_percent: this.order_details['discount_percent'],
            tax_percent: this.order_details['vat_percent'],
            total_due: this.order_details['total_price'],
            discount_amount: this.order_details['discount'],
            tax_amount: this.order_details['vat']
        });
        if (!this.generalForm.value['aprvr_id']) {
            this.generalForm.controls['aprvr_id'].setValue(orderCreatorId);
        }
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
        this.financialService.getInvoiceDueDate(params).subscribe(res => {
            try {
                if (params['payment_term_dt'] && res.data.due_dt) {
                    this.generalForm.controls['due_dt'].setValue(this.dt.transform(new Date(res.data.due_dt), 'MM/dd/yyyy'));
                }
            } catch (e) {
                console.log(e);
            }
        });
    }

    selectAddress(type) {
        try {
            switch (type) {
                case 'shipping':
                    const ship_id = this.generalForm.value.shipping_id;
                    if (ship_id) {
                        this.addr_select.shipping = this.findDataById(ship_id, this.customer.shipping);
                    }
                    break;
                case 'billing':
                    const billing_address_id = this.generalForm.value.billing_address_id;
                    if (billing_address_id) {
                        this.addr_select.billing = this.findDataById(billing_address_id, this.customer.billing);
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

    getGenerateCode() {
        this.financialService.getGenerateCode().subscribe(res => {
            this.generalForm.get('inv_num').patchValue(res.data.code);
        });
    }

    payloadData(type) {
        if (this.generalForm.valid && this.list.items.length > 0) {
            if (this.generalForm.get('id').value && this.isEdit) {
                this.updateInvoice(type);
            } else {
                this.createInvoice(type);
            }
        }
    }

    createInvoice(type) {
        const addressId = this.customer.primary[0]['address_id'];
        const billingAddressId = this.addr_select.billing['address_id'];
        const shippingAddressId = this.addr_select.shipping['address_id'];
        const addressArrId = [addressId, billingAddressId, shippingAddressId];
        let params = {};
        params = { ...this.generalForm.value, ...params };
        params['address'] = addressArrId;
        params['order_detail'] = this.transformItemsList(this.list.items);
        console.log(params);
        this.financialService.createInvoice(params).subscribe(res => {
            try {
                if (res.status) {
                    switch (type) {
                        case 'draft':
                            this.toastr.success(res.message);
                            this.router.navigate(['/financial/invoice']);
                            break;
                        case 'submit':
                            this.updateInvoiceStatus('SB', res.data);
                            break;
                        case 'createnew':
                            this.toastr.success(res.message);
                            this.router.navigate(['/financial/invoice']);
                            break;
                    }
                } else {
                    this.toastr.error(res.message, null, { enableHtml: true });
                }
            } catch (e) {
                console.log(e);
            }
        }, err => {
            this.toastr.error(err.message);
        });
    }

    updateInvoice(type) {
        const addressId = this.customer.primary[0]['address_id'];
        const billingAddressId = this.addr_select.billing['address_id'];
        const shippingAddressId = this.addr_select.shipping['address_id'];
        const addressArrId = [addressId, billingAddressId, shippingAddressId];
        let params = {};
        params = { ...this.generalForm.value, ...params };
        params['address'] = addressArrId;
        params['order_detail'] = this.transformItemsList(this.list.items);
        console.log(params);
        this.financialService.updateInvoice(this.invoiceId, params).subscribe(res => {
            try {
                if (res.status) {
                    switch (type) {
                        case 'draft':
                            this.toastr.success(res.message);
                            this.router.navigate(['/financial/invoice']);
                            break;
                        case 'submit':
                            this.updateInvoiceStatus('SB', this.invoiceId);
                            break;
                        case 'createnew':
                            this.toastr.success(res.message);
                            this.router.navigate(['/financial/invoice/create']);
                            break;
                    }
                } else {
                    this.toastr.error(res.message, null, { enableHtml: true });
                }
            } catch (e) {
                console.log(e);
            }
        }, err => {
            this.toastr.error(err.message);
        });
    }

    updateInvoiceStatus(statusCode, invoiceId?) {
        const id = invoiceId ? invoiceId : this.invoiceId;
        const params = {
            status_code: statusCode
        };
        this.financialService.updateInvoiceStatus(id, params).subscribe(res => {
            try {
                if (res.status) {
                    this.toastr.success(res.message);
                    this.router.navigate(['/financial/invoice']);
                } else {
                    this.toastr.error(res.message, null, { enableHtml: true });
                }
            } catch (e) {
                console.log(e);
            }
        }, err => {
            this.toastr.error(err.message);
        });
    }

    transformItemsList(list) {
        console.log(list);
        const transformedArr = [];
        for (const unit of list) {
            const tempItem = {
                order_detail_id: unit.id,
                item_id: unit.item_id,
                sku: unit.sku,
                des: unit.des,
                item_condition_id: unit.item_condition_id,
                order_qty: unit.qty,
                uom: unit.uom_name,
                invoice_qty: unit.qty,
                unit_price: unit.price,
                price_source: unit.quote_detail_id ? 'From Quote' : 'From Master',
                discount: unit.discount,
                discount_percent: unit.discount_percent,
                final_price: unit.total_price
            };
            transformedArr.push(tempItem);
        }
        console.log(transformedArr);
        return transformedArr;
    }

    transformInvoiceDetailsItems(list) {
        console.log(list);
        const transformedArr = [];
        for (const unit of list) {
            const tempItem = {
                id: unit.order_detail_id,
                item_id: unit.item_id,
                sku: unit.sku,
                des: unit.name,
                item_condition_id: unit.item_condition_id,
                qty: unit.order_detail_total_qty,
                uom_name: unit.uom_name,
                invoice_qty: unit.invoice_qty,
                price: unit.unit_price,
                price_source: unit.quote_detail_id ? 'From Quote' : 'From Master',
                discount: unit.discount,
                discount_percent: unit.discount_percent,
                total_price: unit.order_detail_total_price
            };
            transformedArr.push(tempItem);
        }
        console.log(transformedArr);
        return transformedArr;
    }

    updateTotal() {
        this.order_info.total = 0;
        this.order_info.sub_total = 0;
        if (this.list.items !== undefined) {
            (this.list.items || []).forEach((item) => {
                let sub_quantity = 0;
                item.discount = item.discount !== undefined ? item.discount : 0;
                if (!item.products) { item.products = []; }
                item.products.forEach((subItem, index) => {
                    if (item.products.length > 0) {
                        sub_quantity += Number(subItem.order_quantity);
                    }
                });

                const value = (Number(item.sale_price) * (Number(item.order_quantity) + sub_quantity)
                    - (Number(item.sale_price) * (Number(item.order_quantity) + sub_quantity)) * Number(item.discount) / 100)
                    - (item.promotion_discount_amount ? item.promotion_discount_amount : 0);

                item.totalItem = value;

                if (value) {
                    this.order_info.sub_total = this.order_info.sub_total + value;
                }
            });

        }
        this.order_info['shipping_cost'] = (this.order_info['shipping_cost'] !== undefined ? this.order_info['shipping_cost'] : 0);
        this.order_info['alt_vat_percent'] = (this.order_info['vat_percent'] !== undefined ? this.order_info['vat_percent'] : 0);
        this.order_info['alt_discount'] = (this.order_info['discount_percent'] !== undefined ? this.order_info['discount_percent'] : 0);
        this.promotionList['total_invoice_discount'] = (this.promotionList['total_invoice_discount']
            ? this.promotionList['total_invoice_discount'] : 0);

        this.order_info.total_discount = parseFloat((this.order_info.sub_total * Number(this.order_info['alt_discount']) / 100).toFixed(2));
        const sub_after_discount = this.order_info.sub_total - this.order_info.total_discount;
        this.order_info['vat_percent_amount'] = parseFloat((sub_after_discount * Number(this.order_info['alt_vat_percent']) / 100).toFixed(2));
        this.order_info.total = this.order_info.sub_total - this.order_info.total_discount + Number(this.order_info['shipping_cost']) + this.order_info['vat_percent_amount'] - this.promotionList['total_invoice_discount'];
    }

    numberMaskObject(max?) {
        return createNumberMask({
            allowDecimal: true,
            prefix: '',
            integerLimit: max || null
        });
    }

}
