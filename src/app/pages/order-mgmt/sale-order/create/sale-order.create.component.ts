import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { OrderService } from '../../order-mgmt.service';

import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { ItemQuoteModalContent } from '../../../../shared/modals/item-quote.modal';
import { ItemModalContent } from '../../../../shared/modals/item.modal';
import { OrderHistoryModalContent } from '../../../../shared/modals/order-history.modal';
import { OrderSaleQuoteModalContent } from '../../../../shared/modals/order-salequote.modal';
import { PromotionModalContent } from '../../../../shared/modals/promotion.modal';
import { SaleOrderCreateKeyService } from './keys.control';


@Component({
    selector: 'app-create-order',
    templateUrl: './sale-order.create.component.html',
    styleUrls: ['../sale-order.component.scss'],
    providers: [SaleOrderCreateKeyService],
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
        private orderService: OrderService,
        public keyService: SaleOrderCreateKeyService,
        private dt: DatePipe ) {
        this.generalForm = fb.group({
            'company_id': [null, Validators.required],
            'customer_po': [null, Validators.required],
            'order_number': [null],
            'type': [null, Validators.required],
            'order_date': [null, Validators.required],
            'delivery_date': [null],
            'contact_user_id': [null],
            'prio_level': [null],
            'is_multi_shp_addr': [null],
            'sales_person': [null],
            'warehouse_id': [null],
            'payment_method': [null],
            'billing_id': [null],
            'shipping_id': [null],
            'note': [null]
        });
        //  Init Key
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        this.listMaster['multi_ship'] = [{ id: 0, label: 'No' }, { id: 1, label: 'Yes' }];
        //  Item
        this.list.items = this.router.getNavigatedData() || [];
        const currentDt = this.dt.transform(new Date(), 'yyyy-MM-dd');
        if (Object.keys(this.list.items).length === 0) { this.list.items = []; }
        this.getListCustomerOption();
        this.getOrderReference();
        this.updateTotal();
        this.copy_addr = {...this.copy_addr, ...this.addr_select};
        this.copy_customer = {...this.copy_customer, ...this.customer};
        this.generalForm.controls['is_multi_shp_addr'].patchValue(0);
        this.generalForm.controls['order_date'].patchValue(currentDt);
    }
    /**
     * Mater Data
     */
    numberMaskObject(max?) {
        return createNumberMask({
            allowDecimal: true,
            prefix: '',
            integerLimit: max || null
        });
    }

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
        this.customer = Object.create(this.copy_customer);
        this.addr_select = Object.create(this.copy_addr);
        if (company_id) {
            this.getDetailCustomerById(company_id);
        }
        this.list.items = [];
        this.generalForm.controls['note'].patchValue('');
        this.updateTotal();
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
        const newRecord = {...record};
        const index = list.indexOf(record);
        const objIndex = list[index];
        objIndex.products.push(newRecord);
        this.list.items = list;
        this.updateTotal();
    }

    checkLengthRecord(id, list) {
        let total = 0;
        const _list = list || this.list.items;
        _list.forEach( (record) => {
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
        item.source = 'Manual';
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

    deleteAction(id) {
        this.list.items = this.list.items.filter((item) => {
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
                (this.list.items).forEach( (item) => {
                    listAdded.push(item.item_id);
                });
                res.forEach( (item) => {
                    if (item.sale_price) { item.sale_price = Number(item.sale_price); }
                    item['products'] = [];
                    item.order_quantity = 1;
                    item.totalItem = item.sale_price;
                    item.source = 'Manual';
                });

                this.list.items = this.list.items.concat(res.filter( (item) => {
                    return listAdded.indexOf(item.item_id) < 0;
                }));

                this.updateTotal();
            }
        }, dismiss => { });
    }
    addNewItemFromQuote(list, type_get) {
        if (this.generalForm.value.company_id !== null) {
        const modalRef = this.modalService.open(ItemQuoteModalContent, { size: 'lg' });
        modalRef.componentInstance.company_id = this.generalForm.value.company_id;
        modalRef.result.then(res => {
            if (res instanceof Array && res.length > 0) {

                const listAdded = [];
                (this.list.items).forEach( (item) => {
                    listAdded.push(item.item_id);
                });
                res.forEach( (item) => {
                    if (item.sale_price) { item.sale_price = Number(item.sale_price); }
                    item['products'] = [];
                    item.order_quantity = 1;
                    item.totalItem = item.sale_price;
                    item.source = 'Manual';
                });

                this.list.items = this.list.items.concat(res.filter( (item) => {
                    return listAdded.indexOf(item.item_id) < 0;
                }));

                this.updateTotal();
            }
        }, dismiss => { });
    }
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
    showSaleQuoteList() {
        if (this.generalForm.value.company_id !== null) {
            const modalRef = this.modalService.open(OrderSaleQuoteModalContent, { size: 'lg' });
            modalRef.result.then(res => {
                if (res instanceof Array && res.length > 0) {
                    const listAdded = [];
                    (this.list.items).forEach( (item) => {
                        listAdded.push(item.item_id);
                    });
                    res.forEach(  (item) => {
                        if (item.sale_price) { item.sale_price = Number(item.sale_price); }
                        item['products'] = [];
                        item.order_quantity = 1;
                        item.totalItem = item.sale_price;
                        item.source = 'From Quote';
                    });

                    this.list.items = this.list.items.concat(res.filter( (item)  => {
                        return listAdded.indexOf(item.item_id) < 0;
                    }));

                    this.updateTotal();
                    this.generateNote();
                }
            },
                dismiss => { });
            modalRef.componentInstance.company_id = this.generalForm.value.company_id;
        }


    }
    generateNote() {
        let arrSale = [];
        const temp = this.list.items;
        for (const unit in temp) {
            if (typeof(unit['sale_quote_num']) !==  'undefined') {
                arrSale.push(unit['sale_quote_num']);
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
        const products = [];
        this.list.items.forEach((item) => {
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
                item.products.forEach( (subItem, index) => {
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
                    'is_draft_order': 0
                };
                break;
            case 'draft':
                params = {
                    'items': products,
                    'is_draft_order': 1
                };
                break;
        }
        params = {...this.order_info, ...this.generalForm.value, ...params};
        this.orderService.createOrder(params).subscribe(res => {
            try {
                if (res.data.status) {
                    this.toastr.success(res.data.message);
                    setTimeout(() => {
                        this.router.navigate(['/order-management/sale-order']);
                    }, 500);
                } else {
                    this.toastr.error(res.data.message, null, { enableHtml: true });
                }
            } catch (e) {
                console.log(e);
            }
        },
            err => {
                  this.toastr.error(err.message);
            });
    }

}

