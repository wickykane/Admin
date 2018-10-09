import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';

import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { NgbDateCustomParserFormatter } from '../../../../shared/helper/dateformat';
import { RMAService } from '../rma.service';
import { RMACreateKeyService } from './keys.control';

import { HotkeysService } from 'angular2-hotkeys';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { cdArrowTable } from '../../../../shared/index';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { ItemModalContent } from '../../../../shared/modals/item.modal';
import { ItemsOrderModalContent } from '../modals/items-order.modal';

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
    public listMaster = {
        list_order: [],
        type: [],
        carrier: [],
        customer: [],
        sale_mans: [],
        ship_via: [],
        return_reason: [],
        list_invoice: []
    };
    public selectedIndex = 0;
    public selectedIndex2 = 0;
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
        order_summary: {},
        taxs: []
    };

    public order_info_replace = {
        total: 0,
        sub_total: 0,
        order_summary: {},
        taxs: []
    };

    public list = {
        returnItem: [],
        returnItem_delete: [],
        replaceItem: [],
        replaceItem_delete: []
    };

    public currentDt;
    public requiredInv = false;

    public messageConfig = {
        'SB': 'Are you sure that you want to submit this return order to approver?', // Submit
        'AR': 'Are you sure that you approve and send this return order to Warehouse for receipt?', // waiting receive
        'back': 'The data you have entered may not be saved, are you sure that you want to leave?'
    };

    public searchKey = new Subject<any>(); // Lazy load filter
    @ViewChild('cdTable') table: cdArrowTable;
    @ViewChild('cdTable2') table2: cdArrowTable;

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
        public _hotkeysService: HotkeysService,
        private dt: DatePipe) {
        this.generalForm = fb.group({
            'company_id': [null, Validators.required],
            'rma_no': [null, Validators.required],
            'request_date': [null, Validators.required],
            'order_id': [null],
            'invoice_id': [null],
            'status': [null],
            'return_time': [null],
            'delivery_date': [null],
            'sale_person_id': [null, Validators.required],
            'approver_id': [null, Validators.required],
            'order_return_type': [null, Validators.required],
            'warehouse': [null, Validators.required],
            'ship_via': [null],
            'carrier': [null],
            'carrier_id': [null],
            'tracking_no': [null],
            'arrival_date': [null],
            'bill_to': [null, Validators.required],
            'ship_to': [null, Validators.required],
            'des': [null],
        });
        //  Init Key
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    ngOnInit() {
        const user = JSON.parse(localStorage.getItem('currentUser'));

        this.service.getOrderReference().subscribe(res => {
            this.listMaster['sale_mans'] = res.data.sale_mans || []; this.refresh();
        });

        this.service.getRMAMasterData().subscribe(res => {
            this.generalForm.controls['rma_no'].patchValue(res.data.cd);
            this.listMaster['type'] = res.data.return_type || [];
            this.listMaster['ship_via'] = res.data.ship_via || [];
            this.listMaster['return_reason'] = res.data.return_reason || [];
            this.listMaster['carrier'] = res.data.carrier || [];
            this.refresh();
        });

        //  Item
        this.list.replaceItem = [];
        this.list.returnItem = [];

        this.currentDt = new Date();
        this.generalForm.controls['request_date'].patchValue(this.currentDt);
        this.generalForm.controls['arrival_date'].patchValue(this.currentDt);


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
        this.cd.detectChanges();
    }

    selectData(data) { }

    selectData2(data) { }

    selectTable() {

        this.data['cdTable'] = 'table2';
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

    selectTable2() {

        this.data['cdTable'] = 'table';
        this.selectedIndex2 = 0;
        this.table2.scrollToTable();
        setTimeout(() => {
            const button = this.table2.element.nativeElement.querySelectorAll('td button');
            if (button && button[this.selectedIndex2]) {
                button[this.selectedIndex2].focus();
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

    getDetailCustomerById(company_id) {
        this.service.getDetailCompany(company_id).subscribe(res => {
            try {
                this.customer = res.data;

                const default_billing = (this.customer.billing || []).find(item => item.set_default) || {};
                const default_shipping = (this.customer.shipping || []).find(item => item.set_default) || {};
                this.generalForm.patchValue({
                    bill_to: default_billing.address_id || null,
                    ship_to: default_shipping.address_id || null,
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
    backList() {
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                setTimeout(() => {
                    this.router.navigate(['/order-management/return-order']);
                }, 500);
            }
        }, dismiss => { });
        modalRef.componentInstance.message = this.messageConfig['back'];
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }

    changeCustomer() {
        const company_id = this.generalForm.value.company_id;
        if (company_id) {
            this.getDetailCustomerById(company_id);
            this.getListOrder(company_id);
        }

    }

    changeSalesOrder() {

        const orderId = this.generalForm.value.order_id;
        this.list.returnItem = [];
        this.list.returnItem_delete = [];

        if (orderId !== null && orderId !== undefined) {
            this.getOrderInformation(orderId);
            this.getListLineItems(orderId);
            this.getListInvoice(orderId);
        }
        this.refresh();

        this.list.returnItem.forEach(item => {
            item['reason'] = [];
        });
    }

    checkInvoice() {

        const check = this.listMaster['list_invoice'].filter(item => item.id === this.generalForm.value.invoice_id);

        if (check[0]['pod_sign_off_date']) {
            const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
            modalRef.result.then(res => {
                this.router.navigate(['/financial/invoice/edit', check[0]['id']]);
            }, dismiss => {
                this.generalForm.patchValue({ invoice_id: null });
            });
            modalRef.componentInstance.message = 'Please update POD Date for the input invoice so that the system will calculate the return rate correctly';
            modalRef.componentInstance.yesButtonText = 'Yes';
            modalRef.componentInstance.noButtonText = 'No';
        }

        const params = {
            order_id: this.generalForm.value.order_id,
            invoice_id: this.generalForm.value.invoice_id,
            request_date: moment(this.generalForm.value.request_date).format('MM/DD/YYYY')
        };

        this.service.checkDateTime(params).subscribe(
            res => {
                try {
                    this.generalForm.patchValue({ return_time: res.data.return_time, delivery_date: res.data.delivery_date });
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    getListOrder(company_id) {
        this.service.listOrderByCompany(company_id).subscribe(
            res => {
                try {
                    this.listMaster['list_order'] = res.data;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    getListInvoice(orderId) {
        this.service.listInvoiceByOrder(orderId).subscribe(
            res => {
                try {
                    this.listMaster['list_invoice'] = res.data;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    getOrderInformation(id) {

        this.service.getOrderDetail(id).subscribe(res => {
            try {
                const data = res.data;
                this.generalForm.patchValue({
                    sale_person_id: data.sale_person_id,
                    approver_id: data.approver_id,
                    warehouse: data.warehouse_name
                });

                if (data.order_sts_short_name === 'PD' || data.order_sts_short_name === 'CP') {
                    this.requiredInv = true;
                    this.generalForm.get('invoice_id').setValidators([Validators.required]);
                    this.generalForm.get('invoice_id').updateValueAndValidity();
                }

                if (data.order_sts_short_name === 'AP' || data.order_sts_short_name === 'IP' || data.order_sts_short_name === 'PP' || data.order_sts_short_name === 'RS') {
                    this.requiredInv = false;
                    this.generalForm.get('invoice_id').clearValidators();
                    this.generalForm.get('invoice_id').updateValueAndValidity();
                }


                // Set item and update
                this.list.returnItem = (data.items || []);
                this.list.returnItem.forEach(item => {
                    item['reason'] = this.listMaster['return_reason'];
                    item['return_quantity'] = item['qty_return'];
                });

                this.calcTotal();

                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }


    getListLineItems(orderId) {
        // this.service.getListLineItems(orderId).subscribe(
        //     res => {
        //         try {
        //             this.list.returnItem = [...res.data];
        //             this.refresh();
        //         } catch (err) {
        //             console.log(err);
        //         }
        //     }, err => {
        //         console.log(err);
        //     }
        // );
    }


    changeType() {

    }

    selectAddress(type, flag?) {
        try {
            switch (type) {
                case 'shipping':
                    const ship_id = this.generalForm.value.ship_to;

                    if (ship_id) {
                        this.addr_select.shipping = this.findDataById(ship_id, this.customer.shipping);
                    }
                    break;
                case 'billing':
                    const bill_to = this.generalForm.value.bill_to;
                    if (bill_to) {
                        this.addr_select.billing = this.findDataById(bill_to, this.customer.billing);
                    }
                    break;
            }
            this.refresh();
        } catch (e) {
            console.log(e);
        }
    }


    changeShipVia() {
        if (this.generalForm.value.ship_via === 2) {
            this.generalForm.get('carrier_id').setValidators([Validators.required]);
            this.generalForm.get('carrier_id').updateValueAndValidity();
        } else {
            this.generalForm.get('carrier_id').clearValidators();
            this.generalForm.get('carrier_id').updateValueAndValidity();
        }
    }

    findDataById(id, arr) {
        const item = arr.filter(x => x.address_id === id);
        return item[0];
    }

    groupTax(items) {
        this.order_info['taxs'] = [];
        this.order_info['total_tax'] = 0;
        const taxs = items.map(item => item.tax_percent || 0);
        const unique = taxs.filter((i, index) => taxs.indexOf(i) === index);
        unique.forEach((tax, index) => {
            let taxAmount = 0;
            items.filter(item => item.tax_percent === tax).map(i => {
                taxAmount += (+i.tax_percent * +i.return_quantity * ((+i.sale_price || 0) * (100 - (+i.discount_percent || 0)) / 100) / 100);
            });
            this.order_info['total_tax'] = this.order_info['total_tax'] + +(taxAmount.toFixed(2));
            this.order_info['taxs'].push({
                value: tax, amount: taxAmount.toFixed(2)
            });
        });
    }

    calcTotal() {

        this.order_info.total = 0;
        this.order_info.sub_total = 0;

        this.groupTax(this.list.returnItem);
        this.order_info.order_summary = {};
        this.list.returnItem.forEach(item => {
            this.order_info.order_summary['total_item'] = (this.order_info.order_summary['total_item'] || 0) + (+item.return_quantity);
            this.order_info.order_summary['total_cogs'] = (this.order_info.order_summary['total_cogs'] || 0) + (+item.cost_price || 0) * (item.return_quantity || 0);
        });


        this.list.returnItem.forEach(item => {
            item.amount = ((+item.return_quantity || 0) * (+item.sale_price || 0)) * (100 - (+item.discount_percent || 0)) / 100;
            this.order_info.sub_total += item.amount;
        });

        this.order_info.total = +this.order_info['total_tax'] + +this.order_info.sub_total;
        this.refresh();
    }

    updateTotal() {
        this.order_info_replace.total = 0;
        this.order_info_replace.sub_total = 0;

        this.order_info_replace.order_summary = {};
        this.list.replaceItem.forEach(item => {
            this.order_info_replace.order_summary['total_item'] = (this.order_info_replace.order_summary['total_item'] || 0) + (+item.replace_quantity);
            this.order_info_replace.order_summary['total_cogs'] = (this.order_info_replace.order_summary['total_cogs'] || 0) + (+item.cost_price || 0) * (item.replace_quantity || 0);
        });


        this.list.replaceItem.forEach(item => {
            item.amount = (+item.replace_quantity * (+item.sale_price || 0)) * (100 - (+item.discount_percent || 0)) / 100;
            this.order_info_replace.sub_total += item.amount;
        });

        this.order_info_replace.total = +this.order_info_replace.sub_total;
        this.refresh();
    }

    deleteLineItem(deletedItem, index) {
        deletedItem.deleted = true;
        this.list.returnItem_delete.push(deletedItem);
        this.list.returnItem.splice(index, 1);
        this.calcTotal();
        this.refresh();
    }

    deleteAction(sku, item_condition) {
        this.list.replaceItem = this.list.replaceItem.filter((item) => {
            return (item.sku + (item.item_condition_id || 'mis') !== (sku + (item_condition || 'mis')));
        });
        this.updateTotal();
    }

    openModalAddItemsOrder() {
        const modalRef = this.modalService.open(ItemsOrderModalContent, {
            size: 'lg'
        });
        const params = {
            items: this.list.returnItem_delete
        };
        modalRef.componentInstance.setIgnoredItems = params;

        modalRef.result.then(res => {
            if (this.keyService.keys.length > 0) {
                this.keyService.reInitKey();
                this.table.reInitKey(this.data['tableKey']);
            }
            if (res) {
                res.forEach(selectedItem => {
                    const itemIndex = this.list.returnItem_delete.findIndex(item => item.order_detail_id === selectedItem.order_detail_id);
                    if (itemIndex >= 0) {
                        this.list.returnItem_delete.splice(itemIndex, 1);
                    }
                    this.list.returnItem.push(selectedItem);
                    this.list.returnItem.forEach(item => {
                        item['reason'] = this.listMaster['return_reason'];
                        item['return_quantity'] = item['qty_return'];
                    });
                });
                this.calcTotal();
                // this.selectTable();
            }
        }, dismiss => {
            console.log(this.data['tableKey']);
            if (this.keyService.keys.length > 0) {
                this.keyService.reInitKey();
                this.table.reInitKey(this.data['tableKey']);
            }
        });
    }

    addNewItem() {
        const modalRef = this.modalService.open(ItemModalContent, { size: 'lg' });
        modalRef.result.then(res => {
            if (this.keyService.keys.length > 0) {
                this.keyService.reInitKey();
                this.table2.reInitKey(this.data['tableKey']);
            }
            if (res instanceof Array && res.length > 0) {
                const listAdded = [];
                (this.list.replaceItem).forEach((item) => {
                    listAdded.push(item.sku + item.item_condition_id);
                });
                res.forEach((item) => {
                    if (item.sale_price) { item.sale_price = Number(item.sale_price); }
                    item.tax_percent = 0;
                    item.replace_quantity = 1;
                    item['order_detail_id'] = null;
                    item.discount_percent = 0;
                    item.source_id = 0;
                    item.source_name = 'From Master';
                    item.is_shipping_free = item.free_ship;
                });
                this.list.replaceItem = this.list.replaceItem.concat(res.filter((item) => {
                    if (listAdded.indexOf(item.sku + item.item_condition_id) < 0) {
                        return listAdded.indexOf(item.sku + item.item_condition_id) < 0;
                    } else {
                        this.toastr.error('The item ' + item.sku + ' already added in the order');
                    }
                }));

                this.updateTotal();
                // this.selectTable2();
            }
        }, dismiss => {
            if (this.keyService.keys.length > 0) {
                this.keyService.reInitKey();
                this.table2.reInitKey(this.data['tableKey']);
            }
        });

    }


    confirmCreateOrder(type) {
        if (type !== 'NW') {
            const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
            modalRef.result.then(res => {
                if (res) {
                    this.createOrder(type);
                }
            }, dismiss => { });
            modalRef.componentInstance.message = this.messageConfig[type];
            modalRef.componentInstance.yesButtonText = 'Yes';
            modalRef.componentInstance.noButtonText = 'No';
        } else {
            this.createOrder(type);
        }

    }

    createOrder(type) {

        this.generalForm.patchValue({
            request_date: moment(this.generalForm.value.request_date).format('MM/DD/YYYY'),
            arrival_date: moment(this.generalForm.value.arrival_date).format('MM/DD/YYYY')
        });
        let params = {};
        switch (type) {
            case 'SB':
                params = {
                    'items': this.list.returnItem,
                    'replace_items': this.list.replaceItem || null,
                    'status': 3
                };
                break;
            case 'AR':
                params = {
                    'items': this.list.returnItem,
                    'replace_items': this.list.replaceItem || null,
                    'status': 5
                };
                break;
            case 'NW':
                params = {
                    'items': this.list.returnItem,
                    'replace_items': this.list.replaceItem || null,
                    'status': 1
                };
                break;
        }
        params = { ...this.generalForm.getRawValue(), ...params };

        console.log(params);

        this.service.createReturnOrder(params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                setTimeout(() => {
                    this.router.navigate(['/order-management/return-order']);
                }, 500);
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
        this.service.getAllCustomer(params).subscribe(res => {
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
        this.service.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = res.data.rows;
            this.data['total_page'] = res.data.total_page;
            this.refresh();
        });
    }

}
