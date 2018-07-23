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
        shipping_cost: 0
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
            'due_dt': [null],
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
            'order_detail': [null],
            // 'shp_cost': [null],
            // 'sub_tot': [null],
            // 'dsct_pct': [null],
            // 'tax_pct': [null],
            // 'tot_amt': [null],
            // 'dsct_pct_amt': [null],
            // 'tax_pct_amt': [null],
            // 'address': [null],
            // 'items': [null],
        });
    }

    ngOnInit() {
        let path = window.location.pathname;
        this.route.params.subscribe(params => {
            if (params.id) {
                this.isCreate = false;
                this.isEdit = true;
                this.headerTitle = "EDIT INVOICE";
                this.invoiceId = params.id;
                this.getDetailInvoice(this.invoiceId);
            } else {
                this.isCreate = true;
                this.isEdit = false;
                this.headerTitle = "CREATE NEW INVOICE";
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
        this.getListPaymentTerm();
        this.updateTotal();
        this.copy_addr = { ...this.copy_addr, ...this.addr_select };
        this.copy_customer = { ...this.copy_customer, ...this.customer };
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

    getDetailInvoice(id) {
        if (id) {
            this.financialService.getDetailInvoice(id).subscribe(res => {
                this.invoice_details = res.data;
                this.generalForm.patchValue(this.invoice_details);
                this.generalForm.controls['inv_dt'].patchValue(this.dt.transform(new Date(res.data.inv_dt), 'yyyy-MM-dd'));
                this.generalForm.controls['due_dt'].patchValue(this.dt.transform(new Date(res.data.due_dt), 'yyyy-MM-dd'));
                // this.list.items = res.data.items;
                this.generalForm.patchValue({
                    billing_address_id: this.invoice_details['billing_id'],
                    inv_status: this.invoice_details['invoice_status_id']
                });
                if (res.data.company_id) {
                    this.getDetailCustomerById(res.data.company_id);
                    this.getOrderByCustomerId(res.data.company_id);
                }
                // if (res.data.address.billing[0]) {
                //     this.addr_select.billing = res.data.address.billing[0];
                // }
                // if (res.data.address.shipping[0]) {
                //     this.addr_select.shipping = res.data.address.shipping[0];
                // }
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

    getOrderByCustomerId(company_id) {
        this.list_sales_order = [];
        let params = {
            cus_id: company_id
        }
        this.financialService.getOrderByCustomerId(params).subscribe(res => {
            try {
                this.list_sales_order = res.data;
                if (res.data.length > 0) {
                    this.list.items = res.data[0].detail;
                    this.order_details = res.data[0].order;
                    let orderId = this.order_details['id'];
                    let orderNum = this.order_details['code'];
                    let orderCreatorId = this.order_details['created_by'];
                    this.generalForm.patchValue({
                        order_id: orderId,
                        order_num: orderNum,
                        aprvr_id: orderCreatorId,
                        shipping_cost: this.order_details['shipping'],
                        sub_total: this.order_details['sub_total_price'],
                        discount_percent: this.order_details['discount_percent'],
                        tax_percent: this.order_details['vat_percent'],
                        total_due: this.order_details['total_price'],
                        discount_amount: this.order_details['discount'],
                        tax_amount: this.order_details['vat']
                    });
                    this.generalForm.controls['due_dt'].setValue(this.order_details['payment_due_date']);
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
        // this.list_sales_order = [];
        // this.generalForm.controls['ear_payment_incentive'].setValue(event.invoice_EIP.flg_invoice_EIP ? 1 : 0);
        // this.generalForm.controls['apply_late_fee'].setValue(event.invoice_LFP.flg_invoice_LFP ? 1 : 0);
    }

    changeSalesOrder(event) {
        console.log(event)
        if (event) {
            this.list.items = event.detail;
            this.order_details = event.order;
        } else {
            this.list.items = [];
            this.order_details = {};
        }
        let orderId = this.order_details['id'];
        let orderNum = this.order_details['code'];
        let orderCreatorId = this.order_details['created_by'];
        this.generalForm.patchValue({
            order_id: orderId,
            order_num: orderNum,
            aprvr_id: orderCreatorId,
            shipping_cost: this.order_details['shipping'],
            sub_total: this.order_details['sub_total_price'],
            discount_percent: this.order_details['discount_percent'],
            tax_percent: this.order_details['vat_percent'],
            total_due: this.order_details['total_price'],
            discount_amount: this.order_details['discount'],
            tax_amount: this.order_details['vat']
        });
        this.generalForm.controls['due_dt'].setValue(this.order_details['payment_due_date']);
    }

    changePaymentTerms() {
        for (let i = 0; i < this.listMaster['payment_terms'].length; i++) {
            if (this.listMaster['payment_terms'][i].id == this.generalForm.value['payment_term_id']) {
                this.generalForm.controls['payment_term_range'].setValue(this.listMaster['payment_terms'][i].day_limit);
            }
        }
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
        if (this.generalForm.get('id').value && this.isEdit) {
            this.updateInvoice(type);
        } else {
            this.createInvoice(type);
        }
    }

    createInvoice(type) {
        let addressId = this.customer.primary[0]['address_id'];
        let billingAddressId = this.addr_select.billing['address_id'];
        let shippingAddressId = this.addr_select.shipping['address_id'];
        let addressArrId = [addressId, billingAddressId, shippingAddressId]
        let params = {}
        params = { ...this.generalForm.value, ...params };
        params['address'] = addressArrId;
        params['order_detail'] = this.transformItemsList(this.list.items);
        console.log(params)
        this.financialService.createInvoice(params).subscribe(res => {
            try {
                if (res.status) {
                    switch (type) {
                        case 'draft':
                            this.toastr.success(res.message);
                            this.router.navigate(['/financial/invoice']);
                            break;
                        case 'submit':
                            this.updateInvoiceStatus(res.data, 'SB');
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
        let addressId = this.customer.primary[0]['address_id'];
        let billingAddressId = this.addr_select.billing['address_id'];
        let shippingAddressId = this.addr_select.shipping['address_id'];
        let addressArrId = [addressId, billingAddressId, shippingAddressId]
        let params = {};
        // params = { ...this.invoice_details, ...this.generalForm.value, ...params };
        params = { ...this.generalForm.value, ...params };
        params['address'] = addressArrId;
        params['order_detail'] = this.transformItemsList(this.list.items);
        console.log(params)
        this.financialService.updateInvoice(this.invoiceId, params).subscribe(res => {
            try {
                if (res.status) {
                    switch (type) {
                        case 'draft':
                            this.toastr.success(res.message);
                            this.getDetailInvoice(this.invoiceId);
                            break;
                        case 'submit':
                            this.updateInvoiceStatus(this.invoiceId, 'SB');
                            break;
                        case 'createnew':
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

    updateInvoiceStatus(invoiceId, statusCode) {
        let params = {
            status_code: statusCode
        }
        this.financialService.updateInvoiceStatus(invoiceId, params).subscribe(res => {
            try {
                if (res.status) {
                    this.toastr.success(res.message);
                    if (this.isCreate) {
                        this.router.navigate(['/financial/invoice']);
                    } else {
                        this.getDetailInvoice(this.invoiceId);
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

    transformItemsList(list) {
        console.log(list)
        let transformedArr = [];
        for (let i = 0; i < list.length; i++) {
            let tempItem = {
                "order_detail_id": list[i].id,
                "item_id": list[i].item_id,
                "sku": list[i].sku,
                "des": list[i].des,
                "item_condition_id": list[i].item_condition_id,
                "order_qty": list[i].qty,
                "uom": list[i].uom_name,
                "invoice_qty": list[i].qty,
                "unit_price": list[i].price,
                "price_source": list[i].quote_detail_id ? "From Quote" : "From Master",
                "discount": list[i].discount,
                "discount_percent": list[i].discount_percent,
                "final_price": list[i].total_price
            }
            transformedArr.push(tempItem)
        }
        console.log(transformedArr)
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
