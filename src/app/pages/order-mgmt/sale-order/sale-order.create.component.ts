import { Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { OrderService } from '../order-mgmt.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';

import { ItemModalContent } from '../../../shared/modals/item.modal';
import { PromotionModalContent } from '../../../shared/modals/promotion.modal';
import { OrderHistoryModalContent } from '../../../shared/modals/order-history.modal';
import { OrderSaleQuoteModalContent } from '../../../shared/modals/order-salequote.modal';



@Component({
    selector: 'app-create-order',
    templateUrl: './sale-order.create.component.html',
    styleUrls: ['./sale-order.component.scss'],
    animations: [routerTransition()]
})

export class SaleOrderCreateComponent implements OnInit {
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
            'address_name' : '',
            'address_line': '',
            'country_name': '',
            'city_name': '',
            'state_name': '',
            'zip_code': ''
        },
        billing: {
            'address_name' : '',
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
    public promotionList = {};
    public copy_customer = {};
    public copy_addr = {};

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
        private orderService: OrderService) {
        this.generalForm = fb.group({
            'company_id': [null, Validators.required],
            'customer_po': [null, Validators.required],
            'order_number': [null],
            'type': [null, Validators.required],
            'order_date': [new Date(), Validators.required],
            'delivery_date': [null],
            'contact_user_id': [null],
            'prio_level': [null],
            'is_multi_shp_addr': [null],
            'sales_person': [null],
            'warehouse_id': [null],
            'payment_method': [null],
            'billing_id': [null],
            'shipping_id': [null]
        });
    }

    ngOnInit() {
        this.listMaster['multi_ship'] = [{ id: 0, label: 'No' }, { id: 1, label: 'Yes' }];
        // Item
        this.list.items = this.router.getNavigatedData() || [];
        if (Object.keys(this.list.items).length === 0) { this.list.items = []; }
        this.getListCustomerOption();
        this.getOrderReference();
        this.updateTotal();
        this.copy_addr = Object.assign(this.copy_addr, this.customer);
        this.copy_customer = Object.assign(this.copy_customer, this.addr_select);


    }
    /**
     * Mater Data
     */

    getListCustomerOption() {
        this.orderService.getAllCustomer().subscribe(res => {
            try {
                this.listMaster['customer'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }
    getDetailCustomerById(company_id) {
        this.orderService.getDetailCompany(company_id).subscribe(res => {
            try {
                this.customer = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }
    getOrderReference() {
        this.orderService.getOrderReference().subscribe(res => {
            try {
                this.listMaster['pay_type'] = res.data.order_types;
                this.listMaster['payment_method'] = res.data.payment_methods;
                this.listMaster['priority'] = res.data.priority_levels;
                this.listMaster['sale_mans'] = res.data.sale_mans;
                this.listMaster['warehouses'] = res.data.warehouses;
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
        const company_id = this.generalForm.value.company_id;
        if (company_id) {
        //    this.customer:any = Object.assign()
        //    this.addr_select = Object.assign({}, this.copy_addr);
            this.getDetailCustomerById(company_id);
        }
    }
    selectAddress(type) {
        try {
            switch (type) {
                case 'shipping':
                    const ship_id = this.generalForm.value.shipping_id;
                    this.addr_select.shipping = this.findDataById(ship_id, this.customer.shipping);
                    break;
                case 'billing':
                    const billing_id = this.generalForm.value.billing_id;
                    this.addr_select.billing = this.findDataById(billing_id, this.customer.billing);
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    }

    findDataById(id, arr) {
        const item = arr.filter(x => x.address_id === id);
        console.log(item);
        return item[0];
    }

    selectContact() {
        const id = this.generalForm.value.contact_user_id;
        const temp = this.customer.contact.filter(x => x.id === id);
        this.addr_select.contact = temp[0];
    }

    cloneRecord(record, list) {
        const newRecord = Object.assign({}, record);
        const index = list.indexOf(record);
        const objIndex = list[index];
        objIndex.products.push(newRecord);
        this.list.items = list;
        this.updateTotal();
    }

    checkLengthRecord(id, list) {
        let total = 0;
        const _list = list || this.list.items;
        _list.forEach(function (record) {
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

    resetPromo() {
        this.promotionList = [];
        this.list.items.forEach(function (item) {
            item.promotion_discount_amount = 0;
        });
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

                const value = (Number(item.sell_price) * (Number(item.order_quantity) + sub_quantity)
                    - (Number(item.sell_price) * (Number(item.order_quantity) + sub_quantity)) * Number(item.discount) / 100)
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
        this.promotionList['total_invoice_discount'] = (this.promotionList['total_invoice_discount'] ? this.promotionList['total_invoice_discount'] : 0);

        this.order_info.total_discount = parseFloat((this.order_info.sub_total * Number(this.order_info['alt_discount']) / 100).toFixed(2));
        const sub_after_discount = this.order_info.sub_total - this.order_info.total_discount;
        this.order_info['vat_percent_amount'] = parseFloat((sub_after_discount * Number(this.order_info['alt_vat_percent']) / 100).toFixed(2));
        this.order_info.total = this.order_info.sub_total + Number(this.order_info['shipping_cost']) + this.order_info['vat_percent_amount'] - this.promotionList['total_invoice_discount'];
    }

    calcPromotion(company_id) {
        this.orderService.getActiveProgram(company_id).subscribe(res => {
            try {
                this.checkListPromotion(res.results);
            } catch (e) {
                console.log(e);
            }
        });
    }

    deleteAction(id) {
        this.list.items = this.list.items.filter(function (item) {
            return item.item_id !== id;
        });
        this.updateTotal();
    }


    checkListPromotion(data) {
        const modalRef = this.modalService.open(PromotionModalContent, { size: 'lg' });
        modalRef.result.then(res => {
            if ((res) instanceof Array && res.length > 0) {
                this.order_info.selected_programs = res;
                const params = {};
                params['company_id'] = this.order_info.company_id;
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

    addNewItem(list, type_get, buyer_id) {
        const modalRef = this.modalService.open(ItemModalContent, { size: 'lg' });
        modalRef.result.then(res => {
            if (res instanceof Array && res.length > 0) {

                const listAdded = [];
                (this.list.items).forEach(function (item) {
                    listAdded.push(item.item_id);
                });
                res.forEach(function (item) {
                    if (item.sell_price) { item.sell_price = Number(item.sell_price); }
                    item['products'] = [];
                    item.order_quantity = 1;
                    item.totalItem = item.sell_price;
                });

                this.list.items = this.list.items.concat(res.filter(function (item) {
                    return listAdded.indexOf(item.item_id) < 0;
                }));

                this.updateTotal();
            }
        });
    }
    // Show order history
    showViewOrderHistory() {
        if (this.generalForm.value.company_id !== null) {
            const modalRef = this.modalService.open(OrderHistoryModalContent, { size: 'lg' });
            modalRef.componentInstance.company_id = this.generalForm.value.company_id;
            modalRef.result.then(res => {
                if (res instanceof Array && res.length > 0) {
                   console.log(res);
                }
            });
        }
    }
    showSaleQuoteList() {
        if (this.generalForm.value.company_id !== null) {
            const modalRef = this.modalService.open(OrderSaleQuoteModalContent, { size: 'lg' });
            modalRef.result.then(res => {
                if (res instanceof Array && res.length > 0) {

                    const listAdded = [];
                    (this.list.items).forEach(function (item) {
                        listAdded.push(item.item_id);
                    });
                    res.forEach(function (item) {
                        if (item.sell_price) { item.sell_price = Number(item.sell_price); }
                        item['products'] = [];
                        item.order_quantity = 1;
                        item.totalItem = item.sell_price;
                    });

                    this.list.items = this.list.items.concat(res.filter(function (item) {
                        return listAdded.indexOf(item.item_id) < 0;
                    }));

                    this.updateTotal();
                }
            });
            modalRef.componentInstance.company_id = this.generalForm.value.company_id;
        }


    }

    // Promo Program
    goPromoDetail = function (item) {
        if (!item.level || !item.type) { return; }
        this.openPromotionModal(item);
    };

    remove = function (index) {
        this.data['programs'].splice(index, 1);
    };


    createOrder() {
        const products = [];
        this.list.items.forEach(function (item) {
            products.push({
                item_id: item.item_id,
                item_type: item.item_type,
                quantity: item.order_quantity,
                sale_price: item.sale_price,
                discount_percent: item.discount || 0,
                shipping_address_id: item.shipping_address_id,
                warehouse_id: item.warehouse_id || 1
            });

            if (item.products.length > 0) {
                item.products.forEach(function (subItem, index) {
                    products.push({
                        item_id: subItem.item_id,
                        item_type: item.item_type,
                        quantity: subItem.order_quantity,
                        sale_price: subItem.sale_price,
                        discount_percent: subItem.discount || 0,
                        shipping_address_id: subItem.shipping_address_id,
                        warehouse_id: subItem.warehouse_id || 1
                    });
                });
            }

        });

        let params = {
            'items': products,
            'is_draft_order': 0
        };

        params = Object.assign({}, this.order_info, this.generalForm.value, params);
        this.orderService.createOrder(params).subscribe(res => {
            try {
                if (res.results.status) {
                    this.toastr.success(res.results.message);
                    setTimeout(() => {
                        this.router.navigate(['/order-management/sale-order']);
                    }, 500);
                } else {
                    this.toastr.error(res.results.message, null, { enableHtml: true });
                }
            } catch (e) {
                console.log(e);
            }
        },
            err => {
                this.toastr.error(err.message, null, { enableHtml: true });
            });
    }
    saveDraftOrder() {
        const products = [];
        this.list.items.forEach(function (item) {
            products.push({
                item_id: item.item_id,
                item_type: item.item_type,
                quantity: item.order_quantity,
                sale_price: item.sale_price,
                discount_percent: item.discount || 0,
                shipping_address_id: item.shipping_address_id,
                warehouse_id: item.warehouse_id || 1
            });

            if (item.products.length > 0) {
                item.products.forEach(function (subItem, index) {
                    products.push({
                        item_id: subItem.item_id,
                        item_type: item.item_type,
                        quantity: subItem.order_quantity,
                        sale_price: subItem.sale_price,
                        discount_percent: subItem.discount || 0,
                        shipping_address_id: subItem.shipping_address_id,
                        warehouse_id: subItem.warehouse_id || 1
                    });
                });
            }

        });

        let params = {
            'items': products,
            'is_draft_order': 1
        };

        params = Object.assign({}, this.order_info, this.generalForm.value, params);
        this.orderService.createOrder(params).subscribe(res => {
            try {
                if (res.results.status) {
                    this.toastr.success(res.results.message);
                    setTimeout(() => {
                        this.router.navigate(['/order-management/sale-order']);
                    }, 500);
                } else {
                    this.toastr.error(res.results.message, null, { enableHtml: true });
                }
            } catch (e) {
                console.log(e);
            }
        },
            err => {
                this.toastr.error(err.message, null, { enableHtml: true });
            });
    }
    saveQuote() {
        const products = [];
        this.list.items.forEach(function (item) {
            products.push({
                item_id: item.item_id,
                item_type: item.item_type,
                quantity: item.order_quantity,
                sale_price: item.sale_price,
                discount_percent: item.discount || 0,
                shipping_address_id: item.shipping_address_id,
                warehouse_id: item.warehouse_id || 1
            });

            if (item.products.length > 0) {
                item.products.forEach(function (subItem, index) {
                    products.push({
                        item_id: subItem.item_id,
                        item_type: item.item_type,
                        quantity: subItem.order_quantity,
                        sale_price: subItem.sale_price,
                        discount_percent: subItem.discount || 0,
                        shipping_address_id: subItem.shipping_address_id,
                        warehouse_id: subItem.warehouse_id || 1
                    });
                });
            }

        });

        let params = {
            'items': products,
            'is_draft_order': 0
        };
        this.generalForm.controls['type'].patchValue('SAQ');

        params = Object.assign({}, this.order_info, this.generalForm.value, params);
        this.orderService.createOrder(params).subscribe(res => {
            try {
                if (res.results.status) {
                    this.toastr.success(res.results.message);
                    setTimeout(() => {
                        this.router.navigate(['/order-management/sale-order']);
                    }, 500);
                } else {
                    this.toastr.error(res.results.message, null, { enableHtml: true });
                }
            } catch (e) {
                console.log(e);
            }
        },
            err => {
                this.toastr.error(err.message, null, { enableHtml: true });
            });
    }

}

