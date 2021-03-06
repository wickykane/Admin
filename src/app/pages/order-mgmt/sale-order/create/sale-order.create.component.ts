import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { NgbDateCustomParserFormatter } from '../../../../shared/helper/dateformat';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { OrderService } from '../../order-mgmt.service';

import { StorageService } from '../../../../services/storage.service';

// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { cdArrowTable } from '../../../../shared';
import { ItemMiscModalContent } from '../../../../shared/modals/item-misc.modal';
import { ItemModalContent } from '../../../../shared/modals/item.modal';
import { OrderHistoryModalContent } from '../../../../shared/modals/order-history.modal';
import { QuoteModalContent } from '../../../../shared/modals/quote.modal';
import { SaleOrderCreateKeyService } from './keys.control';

import { ROUTE_PERMISSION } from '../../../../services/route-permission.config';


@Component({
    selector: 'app-create-order',
    templateUrl: './sale-order.create.component.html',
    styleUrls: ['../sale-order.component.scss'],
    providers: [SaleOrderCreateKeyService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
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
            'full_name': '',
            'phone': '',
            'email': '',
            'id': ''
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

    public messageConfig = {
        'create': 'Are you sure that you want to save & submit this order to approver?',
        'validate': 'Are you sure that you want to validate this order?',
        'quote': 'Are you sure that you want to save this order as sale quote'
    };

    public searchKey = new Subject<any>(); // Lazy load filter
    @ViewChild(cdArrowTable) table: cdArrowTable;

    /**
     * Init Data
     */
    constructor(
        private vRef: ViewContainerRef,
        private cd: ChangeDetectorRef,
        private fb: FormBuilder,
        public toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private orderService: OrderService,
        private _hotkeysService: HotkeysService,
        public keyService: SaleOrderCreateKeyService,
        private storage: StorageService,
        private dt: DatePipe) {
        this.generalForm = fb.group({
            'buyer_id': [null, Validators.required],
            'customer_po': [null, Validators.required],
            'order_number': [null],
            'type': ['NO', Validators.required],
            'order_date': [null, Validators.required],
            'delivery_date': [null],
            'contact_user_id': [null],
            'prio_level': [null, Validators.required],
            'sale_person_id': [null, Validators.required],
            'warehouse_id': [1, Validators.required],
            'payment_method_id': [null, Validators.required],
            'billing_id': [null, Validators.required],
            'shipping_id': [null, Validators.required],
            'description': [null],
            'payment_term_id': [null, Validators.required],
            'approver_id': [null, Validators.required],
            'carrier_id': [1],
            'ship_method_rate': [null, Validators.required],
            'ship_method_option': [null]
        });
        //  Init Key
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    ngOnInit() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        this.listMaster['permission'] = this.storage.getRoutePermission(this.router.url);
        this.orderService.getOrderReference().subscribe(res => {
            Object.assign(this.listMaster, res.data);
            this.listMaster['order_types'] = this.listMaster['order_types'].filter(item => item.code !== 'ONL');
            this.changeOrderType();
        });
        this.orderService.getSQReference().subscribe(res => {
            this.listMaster = { ...this.listMaster, ...res.data };
        });
        this.getListApprover();
        //  Item
        this.list.items = this.router.getNavigatedData() || [];
        const currentDt = new Date();
        if (Object.keys(this.list.items).length === 0) { this.list.items = []; }
        this.updateTotal();
        this.copy_addr = { ...this.copy_addr, ...this.addr_select };
        this.copy_customer = { ...this.copy_customer, ...this.customer };

        this.generalForm.controls['order_date'].patchValue(currentDt.toISOString().slice(0, 10));
        this.generalForm.controls['delivery_date'].patchValue(currentDt.toISOString().slice(0, 10));
        this.generalForm.controls['sale_person_id'].patchValue(user.id);
        this.generalForm.controls['approver_id'].patchValue(user.id);

        this.orderService.generatePOCode().subscribe(res => { this.generalForm.controls['customer_po'].patchValue(res.data); this.refresh(); });

        // Lazy Load filter
        this.data['page'] = 1;
        const params = { page: this.data['page'], length: 100 };
        this.orderService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = res.data.rows;
            this.data['total_page'] = res.data.total_page;
            this.refresh();
        });
        this.searchKey.debounceTime(300).subscribe(key => {
            this.data['page'] = 1;
            this.searchCustomer(key);
        });

        this.refresh();
    }
    /**
     * Mater Data
     */
    refresh() {
        if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    getListApprover() {
        const params = {
            permissions: ROUTE_PERMISSION['sale-order'].approve,
        };
        this.orderService.getListApprover(params).subscribe(res => {
            this.listMaster['approver'] = res.data;
            const defaultValue = (this.listMaster['approver'].find(item => item.id === this.generalForm.value.approver_id) || {}).id || null;
            this.generalForm.patchValue({ approver_id: defaultValue });
        });
    }

    selectTable() {
        this.selectedIndex = 0;
        this.table.scrollToTable();
        setTimeout(() => {
            const button = this.table.element.nativeElement.querySelectorAll('td button');
            if (button && button[this.selectedIndex]) {
                button[this.selectedIndex].focus();
            }
        });
        this.refresh();
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
                // if (res.data.buyer_type === 'PS') {
                this.addr_select.contact = res.data.contact[0] || this.addr_select.contact;
                this.generalForm.patchValue({ contact_user_id: this.addr_select.contact.id });
                // }
                this.generalForm.patchValue({ 'carrier_id': res.data.carrier_id || 4});

                const default_billing = (this.customer.billing || []).find(item => item.set_default) || this.customer.billing[0] || {};
                const default_shipping = (this.customer.shipping || []).find(item => item.set_default) || this.customer.shipping[0] || {};
                this.generalForm.patchValue({
                    billing_id: default_billing.address_id || null,
                    shipping_id: default_shipping.address_id || null,
                    payment_method_id: this.customer.payment_method_id || null,
                    payment_term_id: this.customer.payment_term_id || null,
                });

                if (!_.isEmpty(default_billing)) {
                    this.selectAddress('billing', true);
                }

                if (!_.isEmpty(default_shipping)) {
                    this.selectAddress('shipping', true);
                }
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    /**
     * Internal Function
     */
    back() {
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                setTimeout(() => {
                    this.router.navigate(['/order-management/sale-order']);
                }, 500);
            }
        }, dismiss => { });
        modalRef.componentInstance.message = 'The data you have entered may not be saved, are you sure that you want to leave?';
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }

    changeCustomer() {
        const buyer_id = this.generalForm.getRawValue().buyer_id;
        this.customer = Object.create(this.copy_customer);
        this.addr_select = Object.create(this.copy_addr);
        if (buyer_id) {
            this.getDetailCustomerById(buyer_id);
            this.getActiveSaleQuote(buyer_id);
        }
        // this.list.items = [];
        this.generalForm.controls['description'].patchValue('');
        this.updateTotal();
    }

    getActiveSaleQuote(id) {
        this.orderService.getQuantityActiveQuote(id).subscribe(res => {
            this.data['qty_quote'] = res.data;
        });
    }

    selectAddress(type, flag?) {
        try {
            switch (type) {
                case 'shipping':
                    if (!flag) {
                        this.generalForm.patchValue({ 'carrier_id': 4, 'ship_method_option': null, 'ship_method_rate': null });
                    }
                    const ship_id = this.generalForm.getRawValue().shipping_id;

                    if (ship_id) {
                        this.addr_select.shipping = this.findDataById(ship_id, this.customer.shipping);
                        this.getShippingReference(ship_id);
                    }
                    break;
                case 'billing':
                    const billing_id = this.generalForm.getRawValue().billing_id;
                    if (billing_id) {
                        this.addr_select.billing = this.findDataById(billing_id, this.customer.billing);
                    }
                    break;
            }
            this.refresh();
        } catch (e) {
            console.log(e);
        }
    }

    getShippingReference(id) {
        this.orderService.getShippingReference(id).subscribe(res => {
            this.listMaster['carriers'] = res.data;
            // const arr = res.data.filter(item => item.name === 'UPS');
            // if (arr.length > 0) {
            //     this.generalForm.patchValue({ 'carrier_id': 1, 'ship_method_option': null });
            // }
            this.changeShipVia();
        });
    }

    changeShipVia() {
        const carrier = (this.listMaster['carriers'] || []).find(item => item.id === this.generalForm.getRawValue().carrier_id) || { 'options': [], 'ship_rate': [], 'own_carrirer': '' };
        this.listMaster['options'] = carrier.options || [];
        this.listMaster['ship_rates'] = carrier.ship_rate || [];

        let default_option = null;
        let default_ship_rate = null;
        let enable = false;

        if (+this.generalForm.getRawValue().carrier_id === 2 || this.generalForm.getRawValue().carrier_id !== 999 && !carrier.own_carrirer) {
            default_option = '888';
            default_ship_rate = 7;

            if (+this.generalForm.getRawValue().carrier_id === 1) {
                // default_option = '01';
                default_option = null;
                default_ship_rate = null;
            }

            if (+this.generalForm.getRawValue().carrier_id === 2) {
                default_option = '888';
                default_ship_rate = 7;
            }
            enable = [1, 2].indexOf(+this.generalForm.getRawValue().carrier_id) > -1;

        }

        if (+this.generalForm.getRawValue().carrier_id === 999) {
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
        this.refresh();
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
        const id = this.generalForm.getRawValue().contact_user_id;
        if (id) {
            const temp = this.customer.contact.filter(x => x.id === id);
            this.addr_select.contact = temp[0] || {};
        }
        this.refresh();
    }

    changeFromSource(item) {
        // if (+item.source_id === 3) {
        //     return;
        // }
        item.source_id = 2;
        item.source_name = 'Manual';
        this.refresh();
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
            this.generalForm.patchValue({ carrier_id: 999 });
            this.generalForm.get('carrier_id').disable();
            this.generalForm.get('ship_method_rate').disable();
            this.changeShipVia();
        } else {
            const selected_Code = ['SD', 'ND', 'OT'];
            selected_Code.forEach(key => {
                temp_priority.map(item => {
                    if (item.code === key) {
                        this.list_priority.push(item);
                    }
                });
            });
            this.generalForm.get('prio_level').patchValue('ND');
            this.generalForm.patchValue({ carrier_id: 4 });
            this.generalForm.get('carrier_id').enable();
            this.generalForm.get('ship_method_rate').enable();
            this.changeShipVia();
        }
        this.refresh();
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
        this.refresh();
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
            this.order_info.order_summary['total_vol'] = +((this.order_info.order_summary['total_vol'] || 0) + (+item.vol || 0) * (item.quantity || 0)).toFixed(2);
            this.order_info.order_summary['total_weight'] = +((this.order_info.order_summary['total_weight'] || 0) + (+item.wt || 0) * (item.quantity || 0)).toFixed(2);
        });


        this.list.items.forEach(item => {
            item.amount = (+item.quantity * (+item.sale_price || 0)) * (100 - (+item.discount_percent || 0)) / 100;
            this.order_info.sub_total += item.amount;
        });

        this.order_info.total = +this.order_info['total_tax'] + +this.order_info.sub_total;
        this.refresh();
    }


    getQtyAvail() {
        if (this.list.items && this.list.items.length > 0) {
            this.list.items.map(item => {
                item.warehouse.find(k => {
                    if (k['warehouse_id'] === this.generalForm.getRawValue().warehouse_id) {
                        return item.qty_avail = k.qty_available;
                    }
                });
            });
            this.refresh();
        }
    }

    calcTaxShipping() {
        if (!this.generalForm.getRawValue().ship_method_rate || !this.generalForm.getRawValue().buyer_id) {
            return;
        }
        const params = {
            'customer': this.generalForm.getRawValue().buyer_id,
            'warehouse': this.generalForm.getRawValue().warehouse_id,
            'address': this.generalForm.getRawValue().shipping_id,
            'ship_via': this.generalForm.getRawValue().carrier_id,
            'option': this.generalForm.getRawValue().ship_method_option,
            'ship_rate': this.generalForm.getRawValue().ship_method_rate,
            'items': this.list.items.filter(item => !item.misc_id)
        };
        this.orderService.getTaxShipping(params, 'NW').subscribe(res => {

            res.data.mics = res.data.mics || [];
            const old_misc = this.list.items.filter(item => item.misc_id && [1, 2].indexOf(item.misc_id) === -1 && +item.source_id !== 3);
            const items = res.data.items || this.list.items.filter(item => !item.misc_id);
            const misc = res.data.mics.map(item => {
                item.is_misc = 1;
                item.misc_id = item.id;
                item.discount_percent = 0;
                item.warehouse = this.listMaster['warehouses'];
                return item;
            });

            this.list.items = items.concat(misc, old_misc);

            // Assign tax to all item
            this.list.items.forEach(item => item.tax_percent = res.data.tax_percent);
            this.updateTotal();
            this.order_info['original_ship_cost'] = res.data.price;
            this.refresh();
        });
    }

    deleteAction(sku, item_condition) {
        const lastLength = this.list.items.length;
        this.list.items = this.list.items.filter((item) => {
            return (item.sku + (item.item_condition_id || 'mis') !== (sku + (item_condition || 'mis')));
        });
        const index = this.selectedIndex - (lastLength - this.list.items.length);
        this.selectedIndex = (index < 0) ? 0 : index;
        this.updateTotal();
    }

    addNewItem() {
        const modalRef = this.modalService.open(ItemModalContent, { size: 'lg' });
        modalRef.result.then(res => {
            if (this.keyService.keys.length > 0) {
                this.keyService.reInitKey();
                this.table.reInitKey(this.data['tableKey']);
            }
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
        }, dismiss => {
            if (this.keyService.keys.length > 0) {
                this.keyService.reInitKey();
                this.table.reInitKey(this.data['tableKey']);
            }
        });

    }

    addNewMiscItem() {
        const modalRef = this.modalService.open(ItemMiscModalContent, { size: 'lg' });
        modalRef.result.then(res => {
            if (this.keyService.keys.length > 0) {
                this.keyService.reInitKey();
                this.table.reInitKey(this.data['tableKey']);
            }
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
                    item.warehouse = this.listMaster['warehouses'];
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
        }, dismiss => {
            if (this.keyService.keys.length > 0) {
                this.keyService.reInitKey();
                this.table.reInitKey(this.data['tableKey']);
            }
        });
    }

    showListQuote() {
        if (this.generalForm.value.buyer_id) {
            const modalRef = this.modalService.open(QuoteModalContent, { size: 'lg' });
            modalRef.result.then(res => {
                if (this.keyService.keys.length > 0) {
                    this.keyService.reInitKey();
                    this.table.reInitKey(this.data['tableKey']);
                }
                if (res) {
                    setTimeout(() => {
                        this.router.navigate(['order-management/sale-quotation/detail/', res]);
                    });
                }
            }, dismiss => {
                if (this.keyService.keys.length > 0) {
                    this.keyService.reInitKey();
                    this.table.reInitKey(this.data['tableKey']);
                }
            });
            modalRef.componentInstance.company_id = this.generalForm.value.buyer_id;
        }
    }

    confirmCreateOrder(type) {
        if (type !== 'draft') {
            const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
            modalRef.result.then(res => {
                if (res) {
                    if (type === 'quote') {
                        this.createSaleAsQuote();
                    } else {
                        this.createOrder(type);
                    }
                }
            }, dismiss => { });
            modalRef.componentInstance.message = this.messageConfig[type];
            modalRef.componentInstance.yesButtonText = 'Yes';
            modalRef.componentInstance.noButtonText = 'No';
        } else {
            this.createOrder(type);
        }

    }

    createSaleAsQuote() {
        const products = this.list.items.map(item => {
            item.is_item = (item.misc_id) ? 0 : 1;
            item.misc_id = (item.misc_id) ? item.misc_id : null;
            item.item_id = (item.item_id) ? (item.item_id) : null;
            item.is_shipping_free = (item.is_item) ? (item.is_shipping_free) : 0;
            item.item_condition_id = (item.is_item) ? (item.item_condition_id) : null;
            return item;
        });

        let params = {};
        params = {
            'items': products
        };
        params = { ...this.generalForm.getRawValue(), ...params };

        this.orderService.createSaleAsQuote(params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                setTimeout(() => {
                    this.router.navigate(['/order-management/sale-quotation/detail', res.data.id]);
                }, 500);
            } catch (e) {
                console.log(e);
            }
        });
    }

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
                    'order_sts_id': 6
                };
                break;
            case 'validate':
                params = {
                    'items': products,
                    'is_draft_order': 1,
                    'sale_quote_status_id': 1,
                    'order_sts_id': 5
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
        this.orderService.createOrder(params).subscribe(res => {
            try {
                // if (res.status) {
                this.toastr.success(res.message);
                setTimeout(() => {
                    this.router.navigate(['/order-management/sale-order/detail/', res.data.id]);
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
        const params = { page: this.data['page'], length: 100 };
        if (this.data['searchKey']) {
            params['company_name'] = this.data['searchKey'];
        }
        this.orderService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = this.listMaster['customer'].concat(res.data.rows);
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
        this.orderService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = res.data.rows;
            this.data['total_page'] = res.data.total_page;
            this.refresh();
        });
    }
}
