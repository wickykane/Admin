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
        'payment_method_id': '',
        'payment_term_id': '',
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
        buyer_id: null,
        order_summary: {}
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
            'buyer_id': [null, Validators.required],
            'customer_po': [null, Validators.required],
            'order_number': [null],
            'type': ['NO', Validators.required],
            'order_date': [null, Validators.required],
            'delivery_date': [null],
            'contact_user_id': [null],
            'prio_level': [null],
            'sale_person_id': [null, Validators.required],
            'warehouse_id': [1, Validators.required],
            'payment_method_id': [null, Validators.required],
            'billing_id': [null],
            'shipping_id': [null],
            'description': [null],
            'payment_term_id': [null, Validators.required],
            'approver_id': [null, Validators.required],
            'carrier_id': [2],
            'ship_method_rate': [null, Validators.required],
            'ship_method_option': [null],
            'order_sts_name': [null]
        });
        //  Init Key
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        this.orderService.getOrderReference().subscribe(res => {
            Object.assign(this.listMaster, res.data);
            this.listMaster['order_types'] = this.listMaster['order_types'].filter(item => item.code !== 'ONL');
            this.changeOrderType();
        });
        this.orderService.getSQReference().subscribe(res => {
            this.listMaster = { ...this.listMaster, ...res.data };
        });
        //  Item
        // this.list.items = [];
        const currentDt = new Date();
        this.updateTotal();
        this.copy_addr = { ...this.copy_addr, ...this.addr_select };
        this.copy_customer = { ...this.copy_customer, ...this.customer };

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


        this.getDetailOrder();
    }
    /**
     * Mater Data
     */
    getDetailOrder() {
        this.orderService.getOrderDetail(this.route.snapshot.paramMap.get('id')).subscribe(res => {
            try {

                const data = res.data;
                this.generalForm.patchValue(data);
                this.generalForm.patchValue({
                    order_number: data.code,
                    ship_method_rate: +data.ship_method_rate,
                    ship_method_option: +data.ship_method_option,
                });


                // Set item and update
                this.list.items = (data.items || []);


                this.order_info['original_ship_cost'] = data.original_ship_cost;
                this.updateTotal();
                this.changeCustomer(1);
                // Lazy Load filter
                const params = { page: this.data['page'], length: 15 };
                this.orderService.getAllCustomer(params).subscribe(result => {
                    const idList = result.data.rows.map(item => item.id);
                    this.listMaster['customer'] = result.data.rows;
                    if (idList.indexOf(res.data.buyer_id) === -1) {
                        this.listMaster['customer'].push({ id: res.data.buyer_id, company_name: res.data.buyer_name });
                    }
                    this.data['total_page'] = result.data.total_page;
                });


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

    // getDetailCustomerById(buyer_id, flag?) {
    //     this.orderService.getDetailCompany(buyer_id).subscribe(res => {
    //         try {
    //             this.customer = res.data;
    //             // if (res.data.buyer_type === 'PS') {
    //                 this.addr_select.contact = res.data.contact[0];
    //                 this.generalForm.patchValue({ contact_user_id: res.data.contact[0]['id'] });
    //             // }
    //
    //             if (flag) {
    //                 this.selectAddress('billing', flag);
    //                 this.selectAddress('shipping', flag);
    //             }
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     });
    // }

    getDetailCustomerById(buyer_id, flag?) {
        this.orderService.getDetailCompany(buyer_id).subscribe(res => {
            try {
                this.customer = res.data;
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
                        this.selectAddress('billing', flag);
                    }

                    if (default_shipping) {
                        this.selectAddress('shipping', flag);
                    }
                }

                if (flag) {
                    this.selectAddress('billing', flag);
                    this.selectAddress('shipping', flag);
                }

                if (this.generalForm.value.shipping_id == null) {
                    this.getShippingReference('');
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
        const buyer_id = this.generalForm.value.buyer_id;
        this.customer = Object.create(this.copy_customer);
        this.addr_select = Object.create(this.copy_addr);
        if (buyer_id) {
            this.getDetailCustomerById(buyer_id, flag);
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
                    const ship_id = this.generalForm.value.shipping_id;
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
            this.changeShipVia(flag);
        });
    }

    changeShipVia(flag?) {
        const carrier = this.listMaster['carriers'].find(item => item.id === this.generalForm.value.carrier_id);
        this.listMaster['options'] = carrier.options || [];
        this.listMaster['ship_rates'] = carrier.ship_rate || [];

        // Edit first time not init data
        if (flag) {
            return;
        }

        let default_option = null;
        let default_ship_rate = null;
        let enable = false;

        if (+this.generalForm.value.carrier_id === 2 || this.generalForm.value.carrier_id !== 999 && !carrier.own_carrirer) {
            default_option = 888;
            default_ship_rate = 8;

            if (+this.generalForm.value.carrier_id === 1) {
                default_option = '01';
                default_ship_rate = 9;
            }
            enable = [1, 2].indexOf(+this.generalForm.value.carrier_id) > -1;

        }

        if (+this.generalForm.value.carrier_id === 999) {
            default_ship_rate = 7;
            this.generalForm.patchValue({ shipping_id: null });
            this.generalForm.get('shipping_id').clearValidators();
            this.generalForm.get('shipping_id').updateValueAndValidity();
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
                item.length = function () {
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
        // if (+item.source_id === 3) {
        //     return;
        // }
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
                // taxAmount += (+i.tax_percent * +i.quantity * (+i.sale_price || 0) / 100);
                taxAmount += (+i.tax_percent * +i.quantity * ((+i.sale_price || 0) * (100 - (+i.discount_percent || 0)) / 100) / 100);
            });

            this.order_info['total_tax'] = this.order_info['total_tax'] + +(taxAmount.toFixed(2));
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
        items.forEach(item => {
            this.order_info.order_summary['total_item'] = (this.order_info.order_summary['total_item'] || 0) + (+item.quantity);
            this.order_info.order_summary['total_cogs'] = (this.order_info.order_summary['total_cogs'] || 0) + (+item.cost_price || 0) * (item.quantity || 0);
            this.order_info.order_summary['total_vol'] = (this.order_info.order_summary['total_vol'] || 0) + (+item.vol || 0);
            this.order_info.order_summary['total_weight'] = (this.order_info.order_summary['total_weight'] || 0) + (+item.wt || 0);
        });


        this.list.items.forEach(item => {
            item.amount = (+item.quantity * (+item.sale_price || 0)) * (100 - (+item.discount_percent || 0)) / 100;
            this.order_info.sub_total += item.amount;
        });

        this.order_info.total = +this.order_info['total_tax'] + +this.order_info.sub_total;
    }

    deleteAction(sku, item_condition) {
        this.list.items = this.list.items.filter((item) => {
            return (item.sku + (item.item_condition_id || 'mis') !== (sku + (item_condition || 'mis')));
        });
        this.updateTotal();
    }


    checkListPromotion(data) {
        const modalRef = this.modalService.open(PromotionModalContent, { size: 'lg' });
        modalRef.result.then(res => {
            if ((res) instanceof Array && res.length > 0) {
                const params = {};
                params['buyer_id'] = this.order_info.buyer_id;
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
        if (!this.generalForm.value.shipping_id) {
            return;
        }
        const params = {
            'customer': this.generalForm.value.buyer_id,
            'warehouse': this.generalForm.value.warehouse_id,
            'address': this.generalForm.value.shipping_id,
            'ship_via': this.generalForm.value.carrier_id,
            'option': this.generalForm.getRawValue().ship_method_option,
            'ship_rate': this.generalForm.value.ship_method_rate,
            'items': this.list.items.filter(item => !item.misc_id)
        };
        this.orderService.getTaxShipping(params).subscribe(res => {
            if (res.data.mics) {
                const old_misc = this.list.items.filter(item => item.misc_id && [1, 2].indexOf(item.misc_id) === -1 && +item.source_id !== 3);
                const items = res.data.items;
                const misc = res.data.mics.map(item => {
                    item.is_misc = 1;
                    item.misc_id = item.id;
                    item.discount_percent = 0;
                    return item;
                });

                this.list.items = items.concat(misc, old_misc);
            }

            // Assign tax to all item
            this.list.items.forEach(item => item.tax_percent = res.data.tax_percent);
            this.updateTotal();
            this.order_info['original_ship_cost'] = res.data.price;
        });
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
                    item.tax_percent = 0;
                    item.quantity = 1;
                    item['order_detail_id'] = null;
                    item.discount_percent = 0;
                    item.source_id = 0;
                    item.source_name = 'From Master';
                    item.is_shipping_free = item.free_ship;
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
                    item.discount_percent = 0;
                    item.tax_percent = 0;
                    item.sale_price = 0;
                    item.source_id = 2;
                    item.source_name = 'Manual';
                    item.quantity = 1;
                    item.is_misc = 1;
                    item.uom_name = item.uom;
                    item.misc_id = item.id;
                    item.sku = item.no;
                    item.is_shipping_free = 0;
                    item.income_account_name = item.account_name;
                    item.income_account_id = item.account_id;
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

    remove = function (index) {
        this.data['programs'].splice(index, 1);
    };


    createOrder(type) {
        const products = this.list.items.map(item => {
            item.is_item = (item.misc_id) ? 0 : 1;
            item.misc_id = (item.misc_id) ? item.misc_id : null;
            item.item_id = (item.item_id) ? (item.item_id) : null;
            item.is_shipping_free = (item.is_item) ? (item.is_shipping_free) : 0;
            item.item_condition_id = (item.is_item) ? (item.item_condition_id) : null;
            return item;
        });

        let params = {};
        switch (type) {
            case 'create':
                params = {
                    'items': products,
                    'is_draft_order': 0,
                    'order_sts_id': 1
                };
                break;
            case 'quote':
                params = {
                    'items': products,
                    'is_draft_order': 1,
                    'type': 'SAQ',
                    'sale_quote_status_id': 1,
                };
                break;
            case 'draft':
                params = {
                    'items': products,
                    'is_draft_order': 1,
                    'order_sts_id': 1
                };
                break;
        }
        params = { ...this.generalForm.getRawValue(), ...params };
        this.orderService.updateOrder(params, this.route.snapshot.paramMap.get('id')).subscribe(res => {
            try {
                // if (res.status) {
                this.toastr.success(res.message);
                setTimeout(() => {
                    this.router.navigate(['/order-management/sale-order']);
                }, 500);
                // } else {
                //     this.toastr.error(res.message);
                // }
            } catch (e) {
                console.log(e);
            }
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
