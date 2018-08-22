import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { NgbDateCustomParserFormatter } from '../../../../shared/helper/dateformat';
import { OrderService } from '../../order-mgmt.service';

// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { ItemMiscModalContent } from '../../../../shared/modals/item-misc.modal';
import { ItemModalContent } from '../../../../shared/modals/item.modal';
import { OrderHistoryModalContent } from '../../../../shared/modals/order-history.modal';
// import { OrderSaleQuoteModalContent } from '../../../../shared/modals/order-salequote.modal';
import { PromotionModalContent } from '../../../../shared/modals/promotion.modal';
import { SaleOrderCreateKeyService } from './keys.control';


@Component({
    selector: 'app-edit-order',
    templateUrl: './sale-order.edit.component.html',
    styleUrls: ['../sale-order.component.scss'],
    providers: [SaleOrderCreateKeyService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
    animations: [routerTransition()]
})

export class SaleOrderEditComponent implements OnInit {
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
        order_summary: {},
        sub_total: 0,
        order_date: '',
        customer_po: '',
        total_discount: 0,
        buyer_id: null,
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
    public promotionList = {};
    public copy_customer = {};
    public copy_addr = {};
    public list_priority = [];

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
        public keyService: SaleOrderCreateKeyService,
        private dt: DatePipe) {
        this.generalForm = fb.group({
            'buyer_id': [null], // buyer_id
            'customer_po': [null], // cus_po
            'order_number': [null], // code
            'type': [null], // type
            'order_date': [null], // order_date
            'delivery_date': [null], //
            'contact_user_id': [null], // contact_user_id
            'prio_level': [null], // prio_level
            'sale_person_id': [null], // sale_person_id
            'warehouse_id': [null], // warehouse_id
            'payment_method_id': [null], // payment_method_id
            'billing_id': [null], // billing_info[0]['id']
            'shipping_id': [null], // shipping_id
            'description': [null], // description
            'payment_term_id': [null],
            'approver_id': [null],
            'carrier_id': [null],
            'ship_method_rate': [null],
            'ship_method_option': [null]
        });
        //  Init Key
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        this.orderService.getOrderReference().subscribe(res => {
            Object.assign(this.listMaster, res.data);
            this.changeOrderType();
        });
        this.orderService.getSQReference().subscribe(res => {
            this.listMaster = { ...this.listMaster, ...res.data };
        });
        //  Item
        this.list.items = this.router.getNavigatedData() || [];
        const currentDt = new Date();
        if (Object.keys(this.list.items).length === 0) { this.list.items = []; }
        this.updateTotal();
        this.copy_addr = { ...this.copy_addr, ...this.addr_select };
        this.copy_customer = { ...this.copy_customer, ...this.customer };

        this.getDetailOrder();

        this.data['page'] = 1;
        this.searchKey.subscribe(key => {
            this.data['page'] = 1;
            this.searchCustomer(key);
        });
    }
    /**
     * Mater Data
     */
    getDetailOrder() {
        this.orderService.getOrderDetail(this.route.snapshot.paramMap.get('id')).subscribe(res => {
            try {
                this.list.items = res.data.items;

                // Lazy Load filter
                const params = { page: this.data['page'], length: 15 };
                this.orderService.getAllCustomer(params).subscribe(result => {
                    const idList = result.data.rows.map(item => item.id);
                    this.listMaster['customer'] = result.data.rows;
                    if (idList.indexOf(res.data.buyer_id) === -1) {
                        this.listMaster['customer'].push({ id: res.data.buyer_id, company_name: res.data.buyer_info.buyer_name });
                    }
                    this.data['total_page'] = result.data.total_page;
                });

                this.generalForm.patchValue({ 'buyer_id': res.data.buyer_id });
                this.generalForm.patchValue({ 'customer_po': res.data.customer_po });
                this.generalForm.patchValue({ 'order_number': res.data.code });
                this.generalForm.patchValue({ 'type': res.data.type });
                this.generalForm.patchValue({ 'order_date': res.data.order_date });
                this.generalForm.patchValue({ 'contact_user_id': res.data.contact_user_id });
                this.generalForm.patchValue({ 'prio_level': res.data.prio_level });
                this.generalForm.patchValue({ 'sale_person_id': res.data.sale_person_id });
                this.generalForm.patchValue({ 'warehouse_id': res.data.warehouse_id });
                this.generalForm.patchValue({ 'payment_method_id': res.data.payment_method_id });
                if (res.data.billing_info.length > 0) {
                    this.generalForm.patchValue({ 'billing_id': res.data.billing_info[0]['id'] });
                }
                this.generalForm.patchValue({ 'shipping_id': res.data.shipping_id });
                this.generalForm.patchValue({ 'description': res.data.description });


                this.order_info.total = res.data['total_price'];
                this.order_info.sub_total = res.data['sub_total_price'];

                this.updateTotal();
                this.changeCustomer();


            } catch (e) {
                console.log(e);
            }
        });
    }

    numberMaskObject(max?) {
        return createNumberMask({
            allowDecimal: true,
            prefix: '',
            integerLimit: max || null
        });
    }

    getDetailCustomerById(buyer_id) {
        this.orderService.getDetailCompany(buyer_id).subscribe(res => {
            try {
                this.customer = res.data;
                if (res.data.buyer_type === 'PS') {
                    this.addr_select.contact = res.data.contact[0];
                    this.generalForm.patchValue({ contact_user_id: res.data.contact[0]['id'] });
                }
                this.selectAddress('billing');
                this.selectAddress('shipping');
            } catch (e) {
                console.log(e);
            }
        });
    }

    /**
     * Internal Function
     */
    selectData(data) { }

    changeCustomer() {
        const buyer_id = this.generalForm.value.buyer_id;
        this.customer = Object.create(this.copy_customer);
        this.addr_select = Object.create(this.copy_addr);
        if (buyer_id) {
            this.getDetailCustomerById(buyer_id);
        }
        this.updateTotal();
    }

    selectAddress(type) {
        try {
            switch (type) {
                case 'shipping':
                    const ship_id = this.generalForm.value.shipping_id;
                    if (ship_id) {
                        this.addr_select.shipping = this.findDataById(ship_id, this.customer.shipping);
                        this.getShippingReference(ship_id);
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

    getShippingReference(id) {
        this.orderService.getShippingReference(id).subscribe(res => {
            this.listMaster['carriers'] = res.data;
            this.changeShipVia();
        });
    }

    changeShipVia() {
        const carrier = this.listMaster['carriers'].find(item => item.id === this.generalForm.value.carrier_id);
        this.listMaster['options'] = carrier.options || [];
        this.listMaster['ship_rates'] = carrier.ship_rate || [];
        let default_option = null;
        let default_ship_rate = null;
        if (+this.generalForm.value.carrier_id === 3 || this.generalForm.value.carrier_id !== 999 && !carrier.own_carrirer) {
            default_option = 888;
            default_ship_rate = 8;
        }

        if (+this.generalForm.value.carrier_id === 999) {
            default_ship_rate = 8;
            this.generalForm.patchValue({ shipping_id: null });
            this.generalForm.get('shipping_id').setValidators(null);
        } else {
            this.generalForm.get('shipping_id').setValidators([Validators.required]);
        }

        if (carrier.own_carrirer) {
            default_option = null;
            default_ship_rate = 7;
        }

        this.generalForm.patchValue({ ship_method_option: default_option, ship_method_rate: default_ship_rate });
        this.generalForm.updateValueAndValidity();
    }

    findDataById(id, arr) {
        const item = arr.filter(x => x.address_id === id);
        return item[0];
    }
    _keyPress(event: any) {
        const pattern = /[0-9]/;
        const inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            //  invalid character, prevent input
            event.preventDefault();
        }
    }

    selectContact() {
        const id = this.generalForm.value.contact_user_id;
        if (id) {
            const temp = this.customer.contact.filter(x => x.id === id);
            this.addr_select.contact = temp[0];
        }
    }

    cloneRecord(record, list) {
        const newRecord = { ...record };
        const index = list.indexOf(record);
        const objIndex = list[index];
        objIndex.products.push(newRecord);
        this.list.items = list;
        this.updateTotal();
    }

    checkLengthRecord(id, list) {
        let total = 0;
        const _list = list || this.list.items;
        _list.forEach((record) => {
            if (id === record.item_id) {
                total++;
            }
        });
        return total;
    }
    checkCloneRecord(item, list) {
        try {
            const length = this.customer.shipping.length;
            if (!item.hasOwnProperty('length')) {
                item.length = function() {
                    return this.checkLengthRecord(item, list);
                };
            }

            if (length) {
                let countItem = 1;

                if (list.products.length > 0) {
                    countItem += list.products.length;
                }

                return countItem < length;
            }
        } catch (e) {
            return false;
        }
    }

    changeFromSource(item) {
        if (+item.source_id === 3) {
            return;
        }
        item.source_id = 2;
        item.source_name = 'Manual';
    }

    changeOrderType() {
        this.list_priority = [];
        const temp_priority = _.cloneDeep(this.listMaster['priority_levels']);
        const selected_type = this.generalForm.get('type').value;
        if (selected_type === 'PKU') {
            const selected_Code = ['CW', 'PK'];
            selected_Code.forEach(key => {
                temp_priority.map(item => {
                    if (item.code === key) {
                        this.list_priority.push(item);
                    }
                });
            });
            this.generalForm.get('prio_level').patchValue('CW');
        } else {
            const selected_Code = ['SD', 'ND', 'OT'];
            selected_Code.forEach(key => {
                temp_priority.map(item => {
                    if (item.code === key) {
                        this.list_priority.push(item);
                    }
                });
            });
            this.generalForm.get('prio_level').patchValue('SD');
        }
    }

    groupTax(items) {
        this.order_info['taxs'] = [];
        this.order_info['total_tax'] = 0;
        const taxs = items.map(item => item.tax_percent || 0);
        const unique = taxs.filter((i, index) => taxs.indexOf(i) === index);
        unique.forEach((tax, index) => {
            let taxAmount = 0;
            items.filter(item => item.tax_percent === tax).map(i => {
                taxAmount += (+i.tax_percent * +i.quantity * (+i.sale_price || 0) / 100);
            });
            this.order_info['total_tax'] = this.order_info['total_tax'] + taxAmount.toFixed(2);
            this.order_info['taxs'].push({
                value: tax, amount: taxAmount.toFixed(2)
            });
        });
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
            this.order_info.order_summary['total_vol'] = (this.order_info.order_summary['total_vol'] || 0) + (+item.vol || 0);
            this.order_info.order_summary['total_weight'] = (this.order_info.order_summary['total_weight'] || 0) + (+item.wt || 0);
        });


        this.list.items.forEach(item => {
            item.amount = (+item.quantity * (+item.sale_price || 0)) * (100 - (+item.discount || 0)) / 100;
            this.order_info.sub_total += item.amount;
        });

        this.order_info.total = +this.order_info['total_tax'] + +this.order_info.sub_total;
    }

    deleteAction(id) {
      this.list.items = this.list.items.filter((item) => {
          return (item.item_id + (item.item_condition_id || 'mis') !== (id + (item.item_condition_id || 'mis')));
      });
      this.updateTotal();
    }


    checkListPromotion(data) {
        const modalRef = this.modalService.open(PromotionModalContent, { size: 'lg' });
        modalRef.result.then(res => {
            if ((res) instanceof Array && res.length > 0) {
                this.order_info.selected_programs = res;
                const params = {};
                params['buyer_id'] = this.order_info.buyer_id;
                params['selected_programs'] = this.order_info.selected_programs;
                params['items'] = this.list.items;
                this.orderService.previewOrder(params).subscribe(response => {
                    try {
                        this.promotionList = response.results.promotion;
                        this.list.items = response.results.items;
                    } catch (e) {
                        console.log(e.message);
                    }
                });
            }
        });
        modalRef.componentInstance.data = data;
    }

    getQtyAvail() {
        if (this.list.items && this.list.items.length > 0) {
            this.list.items.map(item => {
                item.warehouse.find(k => {
                    if (k['warehouse_id'] === this.generalForm.value.warehouse_id) {
                        return item.qty_avail = k.qty_available;
                    }
                });
            });
        }
    }

    calcTaxShipping() {
        const params = {
            'customer': this.generalForm.value.buyer_id,
            'address': this.generalForm.value.shipping_id,
            'ship_via': this.generalForm.value.carrier_id,
            'option': this.generalForm.value.ship_method_option,
            'ship_rate': this.generalForm.value.ship_method_rate,
            'items': this.list.items.filter(item => !item.misc_id)
        };
        this.orderService.getTaxShipping(params).subscribe(res => {

            try {
                if (res.status) {
                    this.list.items = res.data.items;
                    const misc = res.data.mics.map(item => {
                        item.is_misc = 1;
                        item.misc_id = item.id;
                        return item;
                    });
                    this.list.items = this.list.items.concat(misc);
                    this.updateTotal();
                    this.order_info['original_ship_cost'] = res.data.price;
                } else {
                    this.toastr.error(res.message);
                }
            } catch (e) {
                console.log(e);
            }

        },
            err => {
                this.toastr.error(err.message);
            });
    }

    addNewItem() {
        const modalRef = this.modalService.open(ItemModalContent, { size: 'lg' });
        modalRef.result.then(res => {
            if (res instanceof Array && res.length > 0) {
                const listAdded = [];
                (this.list.items).forEach((item) => {
                    listAdded.push(item.item_id + item.item_condition_id);
                });
                res.forEach((item) => {
                    if (item.sale_price) { item.sale_price = Number(item.sale_price); }
                    item['products'] = [];
                    item.quantity = 1;
                    item['order_detail_id'] = null;
                    item.totalItem = item.sale_price;
                    item.source_id = 0;
                    item.source_name = 'From Master';
                });
                this.list.items = this.list.items.concat(res.filter((item) => {
                    return listAdded.indexOf(item.item_id + item.item_condition_id) < 0;
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
                    listAdded.push(item.id + (item.item_condition_id || 'misc'));
                });

                res.forEach((item) => {
                    if (item.sale_price) { item.sale_price = Number(item.sale_price); }
                    item.source_id = 3;
                    item.source_name = 'System';
                    item.quantity = 1;
                    item.is_misc = 1;
                    item.uom_name = item.uom;
                    item.misc_id = item.id;
                    item.sku = item.no;
                });

                this.list.items = this.list.items.concat(res.filter((item) => {
                    return listAdded.indexOf(item.id + (item.item_condition_id || 'misc')) < 0;
                }));

                this.updateTotal();
            }
        }, dismiss => { });
    }
    //  Show order history
    showViewOrderHistory() {
        if (this.generalForm.value.buyer_id !== null) {
            const modalRef = this.modalService.open(OrderHistoryModalContent, { size: 'lg' });
            modalRef.componentInstance.buyer_id = this.generalForm.value.buyer_id;
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
        this.generalForm.controls['note'].patchValue(stringNote);
    }

    remove = function(index) {
        this.data['programs'].splice(index, 1);
    };


    createOrder(type) {
      const products = this.list.items.map(item => {
          item.discount_percent = item.discount;
          item.is_item = (item.misc_id) ? 0 : 1;
          item.misc_id = (item.misc_id) ? null : 1;
          item.is_shipping_free = 1;
          item.item_id = (item.item_id) ? (item.item_id) : (item.id);
          item.item_type = (item.item_type) ? (item.item_type) : (item.type);
          item.item_condition_id = (item.item_condition_id) ? (item.item_condition_id) : null;
          return item;
      });

        let params = {};
        switch (type) {
            case 'create':
                params = {
                    'items': products,
                    'is_draft_order': 0
                };
                break;
            case 'quote':
                params = {
                    'items': products,
                    'is_draft_order': 0,
                    'type': 'SAQ'
                };
                break;
            case 'draft':
                params = {
                    'items': products,
                    'is_draft_order': 1
                };
                break;
        }
        params = {...this.generalForm.value, ...params };
        this.orderService.updateOrder(params, this.route.snapshot.paramMap.get('id')).subscribe(res => {
            try {
                if (res.status) {
                    this.toastr.success(res.message);
                    setTimeout(() => {
                        this.router.navigate(['/order-management/sale-order']);
                    }, 500);
                }
            } catch (e) {
                console.log(e);
            }
        },
            err => {
                this.toastr.error(err.message);
            });
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
