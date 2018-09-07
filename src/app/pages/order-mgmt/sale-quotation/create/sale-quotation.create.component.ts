import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';

import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/Subject';
import { routerTransition } from '../../../../router.animations';
import { OrderService } from '../../order-mgmt.service';

import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { NgbDateCustomParserFormatter } from '../../../../shared/helper/dateformat';
import { ItemModalContent } from '../../../../shared/modals/item.modal';
import { OrderHistoryModalContent } from '../../../../shared/modals/order-history.modal';
import { PromotionModalContent } from '../../../../shared/modals/promotion.modal';
import { ItemMiscModalContent } from './../../../../shared/modals/item-misc.modal';
import { SaleQuoteCreateKeyService } from './keys.create.control';

import { HotkeysService } from 'angular2-hotkeys';
import * as _ from 'lodash';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';


@Component({
    selector: 'app-create-quotation',
    templateUrl: './sale-quotation.create.component.html',
    styleUrls: ['../sale-quotation.component.scss'],
    providers: [HotkeysService, SaleQuoteCreateKeyService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
    animations: [routerTransition()]
})

export class SaleQuotationCreateComponent implements OnInit {
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

    public addr_select: any = {
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
            'full_name': '',
            'phone': '',
            'email': ''
        }
    };

    public order_info = {
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

    public copy_customer = {};
    public copy_addr = {};


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
        public keyService: SaleQuoteCreateKeyService,
        private dt: DatePipe) {
        this.generalForm = fb.group({
            'approver_id': [null, Validators.required],
            'sale_quote_no': [null],
            'quote_date': [null, Validators.required],
            'expiry_date': [null, Validators.required],
            'company_id': [null, Validators.required],
            'carrier_id': [1], // Default Ups
            'ship_rate': [null],
            'ship_method_option': [null],
            'warehouse_id': [1, Validators.required],

            'delivery_date': [null],
            'contact_user_id': [null],

            'sales_person': [null, Validators.required],
            'payment_method_id': [null, Validators.required],
            'payment_term_id': [null, Validators.required],
            'billing_id': [null, Validators.required],
            'shipping_id': [null, Validators.required],
            'note': [null]
        });
        //  Init Key
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    ngOnInit() {
        this.data['id'] = this.route.snapshot.queryParams['quote_id'];
        this.data['is_copy'] = this.route.snapshot.queryParams['is_copy'] || 0;

        const user = JSON.parse(localStorage.getItem('currentUser'));
        this.listMaster['multi_ship'] = [{ id: 0, label: 'No' }, { id: 1, label: 'Yes' }];
        this.listMaster['from_src'] = [{ id: 0, label: 'From Master' }, { id: 1, label: 'From Quote' }, { id: 2, label: 'Manual' }];

        this.orderService.getOrderReference().subscribe(res => { Object.assign(this.listMaster, res.data); });
        this.orderService.getSQReference().subscribe(res => {
            this.listMaster = { ...this.listMaster, ...res.data };
        });
        this.orderService.generateSaleQuoteCode().subscribe(res => { this.generalForm.get('sale_quote_no').patchValue(res.data); });

        //  Item
        this.list.items = [];
        const currentDt = new Date();
        this.updateTotal();
        this.copy_addr = { ...this.copy_addr, ...this.addr_select };
        this.copy_customer = { ...this.copy_customer, ...this.customer };

        this.generalForm.get('approver_id').patchValue(user.id);
        this.generalForm.get('sales_person').patchValue(user.id);

        // Init Date
        this.generalForm.controls['quote_date'].patchValue(currentDt.toISOString().slice(0, 10));
        currentDt.setDate(currentDt.getDate() + 30);
        this.generalForm.controls['expiry_date'].patchValue(currentDt.toISOString().slice(0, 10));
        this.generalForm.controls['delivery_date'].patchValue(currentDt.toISOString().slice(0, 10));

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

        // Clone quote handle
        if (this.data['is_copy'] && this.data['id']) {
            this.getDetailQuote();
        }
    }
    /**
     * Mater Data
     */

    getDetailQuote() {
        this.orderService.getSaleQuoteDetail(this.data['id']).subscribe(res => {
            try {
                const data = res.data;
                this.generalForm.patchValue(data);
                this.generalForm.patchValue({
                    company_id: data.buyer_id,
                    sales_person: data.sale_person_id,
                    quote_date: data.qt_dt,
                    expiry_date: data.expire_dt,
                    shipping_id: (data.shipping_id || {}).id,
                    billing_id: (data.billing_id || {}).id,
                    ship_rate: +data.ship_method_rate,
                    ship_method_option: +data.ship_method_option,
                });

                // Set item and update
                this.list.items = (data.items || []).map(item => {
                    item.quantity = item.quantity || item.qty;
                    item.sale_price = item.sale_price || item.price;
                    item.uom_name = item.uom_name || item.uom;
                    item.sku = item.sku || item.misc_no;
                    item.des = item.des || item.misc_name;
                    item.tax_percent = item.tax_percent || 0;
                    item.discount = item.discount_percent || 0;
                    return item;
                });

                this.order_info['original_ship_cost'] = data.original_ship_cost;
                this.selectAddress('shipping', 1);
                this.updateTotal();

                this.changeCustomer(1);

                // Lazy Load filter
                const params = { page: this.data['page'], length: 15 };
                this.orderService.getAllCustomer(params).subscribe(result => {
                    const idList = result.data.rows.map(item => item.id);
                    this.listMaster['customer'] = result.data.rows;
                    if (res.data.buyer_id && idList.indexOf(res.data.buyer_id) === -1) {
                        this.listMaster['customer'].push({ id: res.data.buyer_id, company_name: res.data.buyer_name });
                    }
                    this.data['total_page'] = result.data.total_page;
                });



            } catch (e) {
                console.log(e);
            }
        });
    }

    getDetailCustomerById(company_id, flag?) {
        this.orderService.getDetailCompany(company_id).subscribe(res => {
            try {
                this.customer = res.data;
                if (+this.generalForm.value.carrier_id === 999) {
                    // Default Shipping Id to get List when choose Pick up In store
                    this.data['default_shipping_id'] = this.customer.shipping[0].address_id;
                    this.generalForm.patchValue({ship_method_option : null});
                }

                // if (res.data.buyer_type === 'PS') {
                this.addr_select.contact = res.data.contact[0];
                this.generalForm.patchValue({ contact_user_id: res.data.contact[0]['id'] });
                // }

                if (!flag) {
                    const default_billing = (this.customer.billing || []).find(item => item.set_default) || {};
                    const default_shipping = (this.customer.shipping || []).find(item => item.set_default) || {};
                    this.generalForm.patchValue({
                        billing_id: default_billing.address_id || null,
                        shipping_id: default_shipping.address_id || null,
                        payment_method_id: this.customer.payment_method_id || null,
                        payment_term_id: this.customer.payment_term_id || null,
                    });

                    if (default_billing) {
                        this.selectAddress('billing');
                    }

                    if (default_shipping) {
                        this.selectAddress('shipping');
                    }
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

    changeCustomer(flag?) {
        const company_id = this.generalForm.value.company_id;
        this.customer = { ...this.copy_customer };
        this.addr_select = { ...this.copy_addr };

        if (company_id) {
            this.getDetailCustomerById(company_id, flag);
        }
        if (!flag) {
            // this.list.items = [];
            this.updateTotal();
        }
    }


    selectAddress(type, flag?) {
        try {
            switch (type) {
                case 'shipping':
                    const ship_id = this.generalForm.value.shipping_id || this.data['default_shipping_id'];
                    if (ship_id) {
                        this.addr_select.shipping = this.findDataById(ship_id, this.customer.shipping);
                        this.getShippingReference(ship_id, flag);
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

    getShippingReference(id, flag?) {
        this.orderService.getShippingReference(id).subscribe(res => {
            this.listMaster['carriers'] = res.data;
            this.changeShip(flag);
        });
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

    changeFromSource(item) {
        // if (+item.source_id === 3) {
        //     return;
        // }
        item.source_id = 2;
        item.source_name = 'Manual';
    }

    updateTotal() {
        this.order_info.total = 0;
        this.order_info.sub_total = 0;

        const items = this.list.items.filter(i => !i.misc_id);
        this.groupTax(this.list.items);
        this.order_info.order_summary = {};
        // this.order_info.order_summary['total_item'] = items.length;
        items.forEach(item => {
            this.order_info.order_summary['total_item'] = (this.order_info.order_summary['total_item'] || 0) + (+item.quantity);
            this.order_info.order_summary['total_cogs'] = (this.order_info.order_summary['total_cogs'] || 0) + (+item.cost_price || 0) * (item.quantity || 0);
            this.order_info.order_summary['total_vol'] = (this.order_info.order_summary['total_vol'] || 0) + (+item.vol || 0) * (item.quantity || 0);
            this.order_info.order_summary['total_weight'] = (this.order_info.order_summary['total_weight'] || 0) + (+item.wt || 0) * (item.quantity || 0);
        });


        this.list.items.forEach(item => {
            item.amount = (+item.quantity * (+item.sale_price || 0)) * (100 - (+item.discount || 0)) / 100;
            this.order_info.sub_total += item.amount;
        });

        this.order_info.total = +this.order_info['total_tax'] + +this.order_info.sub_total;
    }

    deleteAction(id, item_condition) {
        this.list.items = this.list.items.filter((item) => {
            return ((item.item_id || item.misc_id) + (item.item_condition_id || 'mis') !== (id + (item_condition || 'mis')));
        });
        this.updateTotal();
    }


    addNewItem() {
        const modalRef = this.modalService.open(ItemModalContent, { size: 'lg' });
        modalRef.result.then(res => {
            if (res instanceof Array && res.length > 0) {
                const listAdded = [];
                (this.list.items).forEach((item) => {
                    listAdded.push(item.sku + item.item_condition_id);
                });
                res.forEach((item) => {
                    if (item.sale_price) { item.sale_price = Number(item.sale_price); }
                    item['products'] = [];
                    item.quantity = 1;
                    item.is_shipping_free = item.is_shipping_free || item.free_ship;
                    item['order_detail_id'] = null;
                    item.totalItem = item.sale_price;
                    item.source_id = 0;
                    item.source_name = 'From Master';
                });
                this.list.items = this.list.items.concat(res.filter((item) => {
                    if (listAdded.indexOf(item.sku + item.item_condition_id) < 0) {
                        return listAdded.indexOf(item.sku + item.item_condition_id) < 0;
                    } else {
                        this.toastr.error('The item ' + item.sku + ' already added in the order');
                    }
                }));

                this.updateTotal();
            }
        }, dismiss => { });
    }

    addNewMiscItem() {
        const modalRef = this.modalService.open(ItemMiscModalContent, { size: 'lg' });
        modalRef.result.then(res => {
            if (res instanceof Array && res.length > 0) {
                const listAdded = [];
                (this.list.items).forEach((item) => {
                    listAdded.push(item.sku + (item.item_condition_id || 'misc'));
                });

                res.forEach((item) => {
                    if (item.sale_price) { item.sale_price = Number(item.sale_price); }
                    item.source_id = 2;
                    item.source_name = 'Manual';
                    item.quantity = 1;
                    item.is_misc = 1;
                    item.uom_name = item.uom;
                    item.misc_id = item.id;
                    item.sku = item.no;
                });

                this.list.items = this.list.items.concat(res.filter((item) => {
                    if (listAdded.indexOf(item.sku + (item.item_condition_id || 'misc')) < 0) {
                        return listAdded.indexOf(item.sku + (item.item_condition_id || 'misc')) < 0;
                    } else {
                        this.toastr.error('The item ' + item.no + ' already added in the order');
                    }

                }));

                this.updateTotal();
            }
        }, dismiss => { });
    }

    changeShip(flag?) {
        const carrier = this.listMaster['carriers'].find(item => item.id === this.generalForm.value.carrier_id) || {};
        this.listMaster['options'] = (carrier.options || []).map(item => {
            item.cd = + item.cd;
            return item;
        });
        this.listMaster['ship_rates'] = carrier.ship_rate || [];

        let default_option = null;
        let default_ship_rate = null;
        let enable = false;
        if (+this.generalForm.value.carrier_id === 2 || this.generalForm.value.carrier_id !== 999 && !carrier.own_carrirer) {
            default_option = 888;
            default_ship_rate = 8;
            enable = [1, 2].indexOf(+this.generalForm.value.carrier_id) > -1;
            if (+this.generalForm.value.carrier_id === 1) {
                default_option = null;
                default_ship_rate = 9;
            }
        }

        if (+this.generalForm.value.carrier_id === 999) {
            default_ship_rate = 7;
            this.generalForm.get('shipping_id').setValidators(null);
            this.addr_select.shipping = {};
            this.generalForm.patchValue({ shipping_id: null });
            this.data['is_pickup'] = 1;
            this.addr_select.shipping = {
                'address_name': '',
                'address_line': '',
                'country_name': '',
                'city_name': '',
                'state_name': '',
                'zip_code': ''
            };
        } else {
            this.generalForm.get('shipping_id').setValidators([Validators.required]);
            this.data['is_pickup'] = 0;
        }

        if (carrier.own_carrirer) {
            default_option = null;
            default_ship_rate = 7;
        }

        // Check disable method options
        if (!enable) {
            this.generalForm.controls['ship_method_option'].disable();
        } else {
            this.generalForm.controls['ship_method_option'].enable();
        }

        // Edit first time not init data
        if (!flag) {
            this.generalForm.patchValue({ ship_method_option: default_option, ship_rate: default_ship_rate });
        }
        this.generalForm.updateValueAndValidity();
    }


    //  Show order history
    showViewOrderHistory() {
        if (this.generalForm.value.company_id !== null) {
            const modalRef = this.modalService.open(OrderHistoryModalContent, { size: 'lg' });
            modalRef.componentInstance.company_id = this.generalForm.value.company_id;
            modalRef.result.then(res => {
                if (res instanceof Array && res.length > 0) {
                    console.log(res);
                }
            }, dismiss => { });
        }
    }

    generateNote() {
        let arrSale = [];
        const temp = this.list.items;
        for (const unit of temp) {
            if (typeof (unit['cd']) !== 'undefined') {
                arrSale.push(unit['cd']);
            }
        }
        arrSale = arrSale.reduce((x, y) => x.includes(y) ? x : [...x, y], []);
        const stringNote = 'This sales order has items added from Quote:' + arrSale.toString();
        this.generalForm.controls['description'].patchValue(stringNote);
    }

    remove = function (index) {
        this.data['programs'].splice(index, 1);
    };


    calculateShipping() {
        if (!this.generalForm.value.shipping_id) {
            return;
        }
        const params = {
            'customer': this.generalForm.value.company_id,
            'address': this.generalForm.value.shipping_id,
            'ship_via': this.generalForm.value.carrier_id,
            'option': this.generalForm.getRawValue().ship_method_option,
            'ship_rate': this.generalForm.value.ship_rate,
            'items': this.list.items.filter(item => !item.misc_id)
        };
        this.orderService.getTaxShipping(params).subscribe(res => {
            const old_misc = this.list.items.filter(item => item.misc_id && [1, 2].indexOf(item.misc_id) === -1 && +item.source_id !== 3);
            const items = res.data.items;
            const misc = (res.data.mics || []).map(item => {
                item.is_misc = 1;
                item.misc_id = item.id;
                return item;
            });
            this.list.items = items.concat(misc, old_misc);

            // Assign tax to all item
            this.list.items.forEach(item => item.tax_percent = res.data.tax_percent);
            this.updateTotal();
            this.order_info['original_ship_cost'] = res.data.price;
        });
    }

    groupTax(items) {
        this.order_info['taxs'] = [];
        this.order_info['total_tax'] = 0;
        const taxs = items.map(item => item.tax_percent || 0);
        const unique = taxs.filter((i, index) => taxs.indexOf(i) === index);
        unique.forEach((tax, index) => {
            let taxAmount = 0;
            items.filter(item => item.tax_percent === tax).map(i => {
                taxAmount += (+i.tax_percent * +i.quantity * ((+i.sale_price || 0) * (100 - (+i.discount || 0)) / 100) / 100);
            });
            this.order_info['total_tax'] = this.order_info['total_tax'] + +(taxAmount.toFixed(2));
            this.order_info['taxs'].push({
                value: tax, amount: taxAmount.toFixed(2)
            });
        });
    }

    createOrder(type, is_draft_sq?) {
        const items = this.list.items.map(item => {
            item.discount_percent = item.discount;
            item.is_item = (item.misc_id) ? 0 : 1;
            return item;
        });

        const params = {
            ...this.generalForm.getRawValue(),
            status_id: type,
            original_ship_cost: this.order_info['original_ship_cost'],
            items,
            is_draft_sq: is_draft_sq || 0,
            is_copy: this.data['is_copy'] || 0,
            is_pickup: this.data['is_pickup'] || 0,
        };

        this.orderService.createQuoteOrder(params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.data['quote_id'] = res.data;
                setTimeout(() => {
                    this.router.navigate(['/order-management/sale-quotation/detail/' + this.data['quote_id']]);
                }, 500);
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
                    this.createOrder(type, is_draft_sq);
                } else {
                    this.router.navigate(['/order-management/sale-quotation']);
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
