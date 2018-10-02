import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { NgbDateCustomParserFormatter } from '../../../shared/helper/dateformat';
import { RMAService } from '../rma.service';
import { RMACreateKeyService } from './keys.control';

import { HotkeysService } from 'angular2-hotkeys';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';
import { ItemModalContent } from '../../../shared/modals/item.modal';

@Component({
    selector: 'app-create-rma',
    templateUrl: './rma.create.component.html',
    styleUrls: ['../rma.component.scss'],
    providers: [DatePipe, RMACreateKeyService, RMAService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class RmaCreateComponent implements OnInit {
    /**
     * Variable Declaration
     */
    public generalForm: FormGroup;
    public listMaster = {};
    public selectedIndex = 0;
    public data = {};
    public customer = {
        billing: [],
        shipping: []
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
        }
    };

    public order_info = {
        total: 0,
        sub_total: 0,
        order_date: '',
        order_summary: {}
    };

    public list = {
        items: []
    };

    currentDt;


    public messageConfig = {
        'create': 'Are you sure that you want to save & submit this order to approver?',
        'validate': 'Are you sure that you want to validate this order?',
        'quote': 'Are you sure that you want to save this order as sale quote'
    };

    public searchKey = new Subject<any>(); // Lazy load filter

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
        private service: RMAService,
        public keyService: RMACreateKeyService,
        private _hotkeysService: HotkeysService,
        private dt: DatePipe) {
        this.generalForm = fb.group({
            'buyer_id': [null, Validators.required],
            'rma_no': [null, Validators.required],
            'request_date': [null, Validators.required],
            'order_no': [null],
            'invoice_no': [null],
            'status': [null],
            'return_date': [null],
            'delivery_date': [null],
            'sale_person_id': [null, Validators.required],
            'approver_id': [null, Validators.required],
            'type': [null, Validators.required],
            'warehouse': [null, Validators.required],
            'carrier_id': [1],
            'carrier_name': [null],
            'tracking_no': [null],
            'arrival_date': [null],
            'billing_id': [null, Validators.required],
            'shipping_id': [null, Validators.required],
            'description': [null],
        });
        //  Init Key
          this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    ngOnInit() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        this.service.getOrderReference().subscribe(res => {this.listMaster['list-order'] = res.data || []; this.refresh(); });
        this.service.getRMATypeReference().subscribe(res => {this.listMaster['type'] = res.data || []; this.refresh(); });
        this.service.generateRMACode().subscribe(res => { this.generalForm.controls['rma_no'].patchValue(res.data); this.refresh(); });
        this.listMaster['carriers'] = [];

        //  Item
        this.list.items = this.router.getNavigatedData() || [];
        if (Object.keys(this.list.items).length === 0) { this.list.items = []; }
        this.updateTotal();

        this.currentDt = new Date();
        this.generalForm.controls['request_date'].patchValue(this.currentDt.toISOString().slice(0, 10));
        this.generalForm.controls['delivery_date'].patchValue(this.currentDt.toISOString().slice(0, 10));
        this.generalForm.controls['arrival_date'].patchValue(this.currentDt.toISOString().slice(0, 10));
        this.generalForm.controls['sale_person_id'].patchValue(user.id);
        this.generalForm.controls['approver_id'].patchValue(user.id);


        // Lazy Load filter
        this.data['page'] = 1;
        const params = { page: this.data['page'], length: 100 };
        this.service.getAllCustomer(params).subscribe(res => {
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
        // this.cd.detectChanges();
    }

    numberMaskObject(max?) {
        return createNumberMask({
            allowDecimal: true,
            prefix: '',
            integerLimit: max || null
        });
    }

    getDetailCustomerById(buyer_id) {
        // this.service.getDetailCompany(buyer_id).subscribe(res => {
        //     try {
        //         this.customer = res.data;
        //
        //         const default_billing = (this.customer.billing || []).find(item => item.set_default) || {};
        //         const default_shipping = (this.customer.shipping || []).find(item => item.set_default) || {};
        //         this.generalForm.patchValue({
        //             billing_id: default_billing.address_id || null,
        //             shipping_id: default_shipping.address_id || null,
        //         });
        //
        //         if (!_.isEmpty(default_billing)) {
        //             this.selectAddress('billing', true);
        //         }
        //
        //         if (!_.isEmpty(default_shipping)) {
        //             this.selectAddress('shipping', true);
        //         }
        //         this.refresh();
        //     } catch (e) {
        //         console.log(e);
        //     }
        // });
    }

    /**
     * Internal Function
     */
    back() {
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                setTimeout(() => {
                    this.router.navigate(['rma']);
                }, 500);
            }
        }, dismiss => { });
        modalRef.componentInstance.message = 'The data you have entered may not be saved, are you sure that you want to leave?';
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }

    changeCustomer() {
        const buyer_id = this.generalForm.value.buyer_id;
        if (buyer_id) {
            this.getDetailCustomerById(buyer_id);
        }
        this.generalForm.controls['description'].patchValue('');
        this.updateTotal();
    }

    changeSalesOrder() {
      // this.generalForm.get('invoice_no').clearValidators();
      // this.generalForm.get('invoice_no').updateValueAndValidity();
      // this.generalForm.get('invoice_no').setValidators([Validators.required]);

      // this.generalForm.patchValue({request_date: 'asdfa'});
      // this.generalForm.patchValue({delivery_date: 'asdfa'});
      // this.generalForm.patchValue({warehouse: 'asdfa'});
    }

    changeType() {

    }

    selectAddress(type, flag?) {
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
            this.refresh();
        } catch (e) {
            console.log(e);
        }
    }

    getShippingReference(id) {
        // this.service.getShippingReference(id).subscribe(res => {
        //     this.listMaster['carriers'] = res.data;
        //     const arr = res.data.filter(item => item.name === 'UPS');
        //     this.changeShipVia();
        // });
    }

    changeShipVia() {

    }

    findDataById(id, arr) {
        const item = arr.filter(x => x.address_id === id);
        return item[0];
    }


    updateTotal() {

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
            this.refresh();
        }
    }



    deleteAction(sku, item_condition) {
        this.list.items = this.list.items.filter((item) => {
            return (item.sku + (item.item_condition_id || 'mis') !== (sku + (item_condition || 'mis')));
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

        // this.service.createSaleAsQuote(params).subscribe(res => {
        //     try {
        //         this.toastr.success(res.message);
        //         setTimeout(() => {
        //             this.router.navigate(['/order-management/sale-order']);
        //         }, 500);
        //     } catch (e) {
        //         console.log(e);
        //     }
        // });
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
        // this.service.createOrder(params).subscribe(res => {
        //     try {
        //         this.toastr.success(res.message);
        //         setTimeout(() => {
        //             this.router.navigate(['/order-management/sale-order']);
        //         }, 500);
        //     } catch (e) {
        //         console.log(e);
        //     }
        // });
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
        // this.service.getAllCustomer(params).subscribe(res => {
        //     this.listMaster['customer'] = this.listMaster['customer'].concat(res.data.rows);
        //     this.data['total_page'] = res.data.total_page;
        //     this.refresh();
        // });
    }

    searchCustomer(key) {
        this.data['searchKey'] = key;
        const params = { page: this.data['page'], length: 100 };
        if (key) {
            params['company_name'] = key;
        }
        // this.service.getAllCustomer(params).subscribe(res => {
        //     this.listMaster['customer'] = res.data.rows;
        //     this.data['total_page'] = res.data.total_page;
        //     this.refresh();
        // });
    }

}
