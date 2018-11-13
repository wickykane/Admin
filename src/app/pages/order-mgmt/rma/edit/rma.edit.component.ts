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
import { RMAEditKeyService } from './keys.control';

import { StorageService } from '../../../../services/storage.service';

import { HotkeysService } from 'angular2-hotkeys';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { ROUTE_PERMISSION } from '../../../../services/route-permission.config';
import { cdArrowTable } from '../../../../shared/index';
import { BackdropModalContent } from '../../../../shared/modals/backdrop.modal';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { ItemModalContent } from '../../../../shared/modals/item.modal';
import { ItemsOrderModalContent } from '../modals/items-order.modal';

@Component({
    selector: 'app-rma.edit',
    templateUrl: './rma.edit.component.html',
    styleUrls: ['../rma.component.scss'],
    providers: [DatePipe, RMAEditKeyService, RMAService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class RmaEditComponent implements OnInit {
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
        approvers: [],
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

    public order_info_after = {
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
    public navigateData;
    public disableEdit = false;
    public flagStockFee = false;
    public itemStockFee = {};

    public messageConfig = {
        'SB': 'Are you sure that you want to submit this return order to approver?', // Submit
        'AR1': 'Are you sure that you want to approve the cancelation and send to warehouse for put back?',
        'AR2': 'Are you sure that you approve and send this return order to Warehouse for receipt?',
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
        public keyService: RMAEditKeyService,
        private storage: StorageService,
        public _hotkeysService: HotkeysService,
        private dt: DatePipe) {
        this.generalForm = fb.group({
            'company_id': [null, Validators.required],
            'cd': [null, Validators.required],
            'request_date': [null, Validators.required],
            'order_id': [null],
            'invoice_id': [null],
            'sts_name': [null],
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
            'note': [null],
        });
        //  Init Key
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    ngOnInit() {


        const user = JSON.parse(localStorage.getItem('currentUser'));
        this.listMaster['permission'] = this.storage.getRoutePermission(this.router.url);

        this.service.getOrderReference().subscribe(res => {
            this.listMaster['sale_mans'] = res.data.sale_mans || []; this.refresh();
        });

        const prams = {
            permissions: ROUTE_PERMISSION['customer'].view,
        };
        this.service.getListApprover(prams).subscribe(res => {
            this.listMaster['approvers'] = res.data;
        });

        this.service.getRMAMasterData().subscribe(res => {
            this.listMaster['type'] = res.data.return_type || [];
            this.listMaster['ship_via'] = res.data.ship_via || [];
            this.listMaster['return_reason'] = res.data.return_reason || [];
            this.listMaster['carrier'] = res.data.carrier || [];
            this.refresh();
        });

        //  Item
        this.list.replaceItem = [];
        this.list.returnItem = [];

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
        this.getDetailRMA();
    }

    getDetailRMA() {
        this.service.getDetailRMA(this.route.snapshot.paramMap.get('id')).subscribe(res => {
            try {
                const data = res.data;
                this.data['order_data'] = data;
                this.generalForm.patchValue(data);
                this.generalForm.patchValue({
                    'warehouse': data.warehouse_name,
                    'bill_to': data['billing_data']['id'] || null,
                    'ship_to': data['shipping_data']['id'] || null,
                    'note': data.des,
                    'ship_via': data.ship_via,
                    'carrier': data.carrier,
                    'carrier_id': data.carrier_id,
                    'tracking_no': data.tracking_no,
                    'arrival_date': data.arrival_date
                });

                // this.generalForm.patchValue({
                //   ship_via: this.generalForm.getRawValue().ship_via,
                //   carrier: this.generalForm.getRawValue().carrier,
                //   carrier_id: this.generalForm.getRawValue().carrier_id,
                //   tracking_no: this.generalForm.getRawValue().tracking_no,
                //   arrival_date: this.generalForm.getRawValue().arrival_date
                // });

                this.list.returnItem = res.data.items || [];
                this.list.returnItem = (res.data.items || []).map(item => {
                    item.amount_after_receipt = +item.amount_after_receipt;
                    item.amount_before_receipt = +item.amount_before_receipt;
                    if (item.sku === 'MIS-0000006') {
                        this.flagStockFee = true;
                        item.price = item.sale_price;
                        item.amount_before_receipt = item.sale_price;
                    }
                    return item;
                });


                this.list.replaceItem = res.data.items_replace || [];


                // Lazy Load filter
                const params = { page: this.data['page'], length: 100 };
                this.service.getAllCustomer(params).subscribe(result => {
                    const idList = result.data.rows.map(item => item.id);
                    this.listMaster['customer'] = result.data.rows;
                    if (idList.indexOf(res.data.company_id) === -1) {
                        this.listMaster['customer'].push({ id: res.data.company_id, company_name: res.data.company_name, name: res.data.company_name });
                    }
                    this.data['total_page'] = result.data.total_page;
                    this.refresh();
                });

                this.service.getOrderDetail(data['order_id']).subscribe(result => {
                    try {
                        const data1 = result.data;
                        this.list.returnItem.forEach(item => {
                            item['reason'] = this.listMaster['return_reason'];
                        });

                        // Set item and update
                        this.calcTotal();

                        this.refresh();
                    } catch (e) {
                        console.log(e);
                    }
                });

                this.service.getDetailCompany(data['company_id']).subscribe(result => {
                    try {
                        this.customer = result.data;

                        const default_billing = (this.customer.billing || []).find(item => item) || {};
                        const default_shipping = (this.customer.shipping || []).find(item => item) || {};

                        if (!_.isEmpty(default_billing)) {
                            this.selectAddress('billing', true);
                        }

                        if (!_.isEmpty(default_shipping)) {
                            this.selectAddress('shipping', true);
                        }

                        this.refresh();
                        this.disableControl();


                    } catch (e) {
                        console.log(e);
                    }
                });

                const p = {
                    company_id: this.generalForm.value.company_id,
                    return_type: this.generalForm.value.order_return_type
                };
                this.service.listOrderByCompany(p).subscribe(
                    result => {
                        try {
                            this.listMaster['list_order'] = result.data;
                            this.refresh();
                        } catch (err) {
                            console.log(err);
                        }
                    }, err => {
                        console.log(err);
                    }
                );

                this.service.listInvoiceByOrder(data['order_id']).subscribe(
                    result => {
                        try {
                            this.listMaster['list_invoice'] = result.data;
                            this.refresh();
                        } catch (err) {
                            console.log(err);
                        }
                    }, err => {
                        console.log(err);
                    }
                );

                if (this.data['order_data']['status_message'] === 1) {
                    this.updateStatus(2, this.data['order_data']['message']);
                }
                if (this.data['order_data']['status_message'] === 0) {
                    if (this.data['order_data']['is_change'] === 1) {
                        this.checkStatusOrder(this.route.snapshot.paramMap.get('id'));
                    }
                }


                // Set item and update
                this.updateTotal();
                this.refresh();



            } catch (e) {
                console.log(e);
            }
        });
    }

    updateStatus(status, message) {
        const modalRef = this.modalService.open(BackdropModalContent, { size: 'lg', windowClass: 'modal-md', backdrop: 'static', keyboard: false });
        modalRef.result.then(res => {
            if (res) {
                const params = { return_order_id: this.route.snapshot.paramMap.get('id'), status_id: status };
                this.service.updateStatus(params).subscribe(result => {
                    try {
                        this.toastr.success('The return order has been updated latest information successfully');
                        this.router.navigate(['/order-management/return-order/detail', this.route.snapshot.paramMap.get('id')]);
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
        }, dismiss => { });
        modalRef.componentInstance.message = message;
        modalRef.componentInstance.yesButtonText = 'OK';
    }

    checkStatusOrder(id) {
        const modalRef = this.modalService.open(BackdropModalContent, { size: 'lg', windowClass: 'modal-md', backdrop: 'static', keyboard: false });
        modalRef.result.then(res => {
            if (res) {
                this.service.updateChange(id).subscribe(result => {
                    try {
                        this.toastr.success('The return order has been updated latest information successfully');
                        this.router.navigate(['/order-management/return-order/detail', id]);
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
        }, dismiss => { });
        modalRef.componentInstance.message = 'There are changes of the sales order. The system will refresh for up to date.';
        modalRef.componentInstance.yesButtonText = 'OK';
    }

    disableControl() {

        if (this.generalForm.value['sts_name'] !== 'New') {
            this.disableEdit = true;

            this.generalForm.get('company_id').disable();
            this.generalForm.get('cd').disable();
            this.generalForm.get('request_date').disable();
            this.generalForm.get('order_id').disable();
            this.generalForm.get('invoice_id').disable();
            this.generalForm.get('return_time').disable();
            this.generalForm.get('delivery_date').disable();
            this.generalForm.get('sale_person_id').disable();
            this.generalForm.get('approver_id').disable();
            this.generalForm.get('order_return_type').disable();

            this.generalForm.get('bill_to').disable();
            this.generalForm.get('ship_to').disable();
            this.generalForm.get('warehouse').disable();

            this.generalForm.get('ship_via').disable();
            this.generalForm.get('tracking_no').disable();
            this.generalForm.get('carrier_id').disable();
            this.generalForm.get('carrier').disable();
            this.generalForm.get('arrival_date').disable();
        }

    }
    /**
     * Mater Data
     */
    refresh() {
        if (!this.cd['destroyed']) { this.cd.detectChanges(); }
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
            if (this.generalForm.value.order_return_type) {
                this.getListOrder();
            }
        }

    }

    changeSalesOrder() {

        const orderId = this.generalForm.value.order_id;
        this.list.returnItem = [];
        this.list.returnItem_delete = [];

        if (orderId !== null && orderId !== undefined) {
            this.getOrderInformation(orderId);
            this.getListInvoice(orderId);
            this.checkDateTime();
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
                this.router.navigate(['/financial/invoice/view', check[0]['id']]);
            }, dismiss => {
                this.generalForm.patchValue({ invoice_id: null });
            });
            modalRef.componentInstance.message = 'Please update POD Date for the input invoice so that the system will calculate the return rate correctly';
            modalRef.componentInstance.yesButtonText = 'Yes';
            modalRef.componentInstance.noButtonText = 'No';
        }

        this.checkDateTime();

    }

    checkDateTime() {
        const params = {
            order_id: this.generalForm.value.order_id,
            invoice_id: this.generalForm.value.invoice_id || null,
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

    getListOrder() {
        const params = {
            company_id: this.generalForm.value.company_id,
            return_type: this.generalForm.value.order_return_type
        };
        this.service.listOrderByCompany(params).subscribe(
            res => {
                try {
                    this.listMaster['list_order'] = res.data;
                    // if (this.listMaster['list_order'].length <= 0) {
                    // this.generalForm.patchValue({ 'order_id': null });
                    // this.generalForm.patchValue({ 'invoice_id': null });
                    // }
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

                    if (this.listMaster['list_invoice'].length > 0) {
                        this.generalForm.patchValue({ 'invoice_id': this.listMaster['list_invoice'][0]['id'] });
                        this.checkInvoice();
                    } else {
                        this.generalForm.patchValue({ 'invoice_id': null });
                    }
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
                    this.generalForm.controls.ship_via.enable();
                }

                if (data.order_sts_short_name === 'AP' || data.order_sts_short_name === 'IP' || data.order_sts_short_name === 'PP' || data.order_sts_short_name === 'RS') {
                    this.requiredInv = false;
                    this.generalForm.get('invoice_id').clearValidators();
                    this.generalForm.get('invoice_id').updateValueAndValidity();
                    this.generalForm.controls.ship_via.disable();
                }


                // Set item and update
                this.list.returnItem = data.items.filter((x => x.is_item));
                this.list.returnItem.forEach(item => {
                    item['reason'] = this.listMaster['return_reason'];
                    item['return_quantity'] = 1;
                });
                this.calcTotal();

                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    changeType() {
        if (this.generalForm.value.company_id) {
            this.getListOrder();
        }
    }

    selectAddress(type, flag?) {
        try {
            switch (type) {
                case 'shipping':
                    const ship_id = this.generalForm.value.ship_to;

                    if (ship_id) {
                        this.addr_select.shipping = this.findDataById(ship_id, this.customer.shipping) || this.addr_select.shipping;
                    }
                    break;
                case 'billing':
                    const bill_to = this.generalForm.value.bill_to;
                    if (bill_to) {
                        this.addr_select.billing = this.findDataById(bill_to, this.customer.billing) || this.addr_select.billing;
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

    groupTaxAfter(items) {
        this.order_info_after['taxs'] = [];
        this.order_info_after['total_tax'] = 0;
        const taxs = items.map(item => item.tax_percent || 0);
        const unique = taxs.filter((i, index) => taxs.indexOf(i) === index);
        unique.forEach((tax, index) => {
            let taxAmount = 0;
            items.filter(item => item.tax_percent === tax).map(i => {
                taxAmount += (+i.tax_percent * +i.accept_quantity * ((+i.sale_price || 0) * (100 - (+i.discount_percent || 0)) / 100) / 100);
            });
            this.order_info_after['total_tax'] = this.order_info_after['total_tax'] + +(taxAmount.toFixed(2));
            this.order_info_after['taxs'].push({
                value: tax, amount: taxAmount.toFixed(2)
            });
        });
    }

    calcTotal() {
        // Before WH
        this.order_info.total = 0;
        this.order_info.sub_total = 0;

        this.groupTax(this.list.returnItem);
        this.order_info.order_summary = {};
        this.list.returnItem.forEach(item => {
            if (item.sku !== 'MIS-0000006') {
                this.order_info.order_summary['total_item'] = (this.order_info.order_summary['total_item'] || 0) + (+item.return_quantity);
                this.order_info.order_summary['total_cogs'] = (this.order_info.order_summary['total_cogs'] || 0) + (+item.cost_price || 0) * (item.return_quantity || 0);
            }
        });


        this.list.returnItem.forEach(item => {
            if (item.sku !== 'MIS-0000006') {
                item.amount = ((+item.return_quantity || 0) * (+item.sale_price || 0)) * (100 - (+item.discount_percent || 0)) / 100;
                this.order_info.sub_total += item.amount;
            }
        });

        this.order_info.total = +this.order_info['total_tax'] + +this.order_info.sub_total;

        // After WH
        this.order_info_after.total = 0;
        this.order_info_after.sub_total = 0;
        let amount = 0;

        this.groupTaxAfter(this.list.returnItem);
        this.order_info_after.order_summary = {};
        this.list.returnItem.forEach(item => {
            if (item.sku !== 'MIS-0000006') {
                this.order_info_after.order_summary['total_item'] = (this.order_info_after.order_summary['total_item'] || 0) + (+item.accept_quantity);
                this.order_info_after.order_summary['total_cogs'] = (this.order_info_after.order_summary['total_cogs'] || 0) + (+item.cost_price || 0) * (item.accept_quantity || 0);
            }
        });


        this.list.returnItem.forEach(item => {
            if (item.sku !== 'MIS-0000006') {
                item.amount = ((+item.accept_quantity || 0) * (+item.sale_price || 0)) * (100 - (+item.discount_percent || 0)) / 100;
                this.order_info_after.sub_total += item.amount;
            } else {
              amount += item.price;
            }
        });

        this.order_info_after.sub_total = this.order_info_after.sub_total - amount;

        this.order_info_after.total = +this.order_info_after['total_tax'] + +this.order_info_after.sub_total;
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

    addStockFee() {
        this.flagStockFee = !this.flagStockFee;
        this.itemStockFee = {
            sku: 'MIS-0000006',
            des: 'Restocking Fee',
            condition_name: '',
            uom_name: 'Each',
            return_quantity: 1,
            accept_quantity: 1,
            price: 1,
            amount_before_receipt: 1,
            misc_id: 6
        };
        if (this.flagStockFee) {
            this.list.returnItem.push(this.itemStockFee);
        } else {
            const itemIndex = this.list.returnItem.findIndex(it => it.sku === 'MIS-0000006');
            this.list.returnItem.splice(itemIndex, 1);
            this.itemStockFee = {};
        }
        this.calcTotal();

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
                        // item['return_quantity'] = item['qty_return'];
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
            modalRef.componentInstance.message = this.requiredInv ? this.messageConfig['AR2'] : this.messageConfig['AR1'];
            modalRef.componentInstance.yesButtonText = 'Yes';
            modalRef.componentInstance.noButtonText = 'No';
        } else {
            this.createOrder(type);
        }

    }

    createOrder(type) {

        // this.generalForm.patchValue({
        //     request_date: moment(this.generalForm.value.request_date).format('MM/DD/YYYY'),
        //     arrival_date: moment(this.generalForm.value.arrival_date).format('MM/DD/YYYY')
        // });
        let params = {};
        switch (type) {
            case 'SB':
                params = {
                    'items': this.data['order_data']['sts'] === 1 ? this.list.returnItem : this.itemStockFee,
                    'replace_items': this.list.replaceItem || null,
                    'status': 3
                };
                break;
            case 'AR':
                params = {
                    'items': this.data['order_data']['sts'] === 1 ? this.list.returnItem : this.itemStockFee,
                    'replace_items': this.list.replaceItem || null,
                    'status': 5
                };
                break;
            case 'NW':
                params = {
                    'items': this.data['order_data']['sts'] === 1 ? this.list.returnItem : this.itemStockFee,
                    'replace_items': this.list.replaceItem || null,
                    // 'status': 1
                };
                break;
        }
        params = { ...this.generalForm.getRawValue(), ...params };

        console.log(params);

        this.service.updateReturnOrder(params, this.route.snapshot.paramMap.get('id')).subscribe(res => {
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
