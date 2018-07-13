import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { RmaService } from '../rma.service';
import { RMACreateKeyService } from './keys.control';

import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { routerTransition } from '../../../router.animations';
import { CommonService } from './../../../services/common.service';

import * as moment from 'moment';

@Component({
    selector: 'app-create-rma',
    templateUrl: './rma.create.component.html',
    styleUrls: ['../rma.component.scss'],
    animations: [routerTransition()],
    providers: [DatePipe, RMACreateKeyService, CommonService]
})

export class RmaCreateComponent implements OnInit {
    /**
     * Variable Declaration
     */
    public generalForm: FormGroup;
    public listMaster = {};
    public selectedIndex = 0;
    public data = {
        shipping: {},
        primary: {},
    };
    public list = {
        items: [],
        checklist: []
    };
    public checkAllItem = true;
    customer = {};
    order_info = {};
    public dataConfig = {};
    /**
     * Init Data
     */
    constructor(
        public keyService: RMACreateKeyService,
        private vRef: ViewContainerRef,
        private fb: FormBuilder,
        public toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private rmaService: RmaService,
        private commonService: CommonService,
        private dt: DatePipe) {
        this.generalForm = fb.group({
            'company_id': [null, Validators.required],
            'rma_number': [null, Validators.required],
            'rma_type': [1, Validators.required],
            'request_date': [moment().format('YYYY-MM-DD'), Validators.required],
            'order_id': [null, Validators.required],
            'return_via': [null, Validators.required],
            'carrier': [null, Validators.required],
            'cover_ship': [1, Validators.required],
            'apply_restock': [null],
            'refund_method': [null, Validators.required],
            'payment_term': [null],
            'approver': [null],
            'billing_id': [null],
            'address_id': [null],
            'note': [null],
            'contact_name': [null],
            'email': [null],
            'phone': [null],
            // Extra data
            'return_time': [null],
            'return_time_id': [null],
            'receiving_date': [null],
            'warehouse': [null],
            'status': [null],
        });

        //  Init Key
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        this.getListCustomer();
        this.checkAll(null, true);

        // Master Data Init

        this.getListRefundMethod();
        this.getListPaymentTerm();
        this.getListCoverShipFee();
        this.getListCarrier();
        this.getListApprover();
        this.getListReturnReason();

        this.updateTotal();

        // Change form data event handle
        this.generalForm.get('return_via').valueChanges.subscribe(data => {
            this.generalForm.patchValue({ carrier: null });
        });
    }

    // Disable Config
    initConfig() {
        const data = this.generalForm.value;
        if (this.generalForm.value.rma_type === 1) {
            // Case 1: RMA Type: Refund, Return Time: During WH Pickup, Receiving Date: Not yet received
            if (data.return_time_id === 1 && data.receiving_date === 'Not yet received') {
                this.dataConfig = {
                    carrier: { disable: true, value: null },
                    cover_ship: { disable: true, value: 2 },
                    return_via: { disable: false, value: 4 }
                };

            }
            // Case 2: RMA Type: Refund, Return Time: Before Delivery
            if (data.return_time_id === 2) {
                this.dataConfig = {
                    carrier: { disable: true, value: null },
                    cover_ship: { disable: true, value: 1 },
                    return_via: { disable: false, value: 4 }
                };
            }

            // Case 3: RMA Type: Refund, Return Time: At Delivery
            if (data.return_time_id === 3) {
                this.dataConfig = {
                };
            }

            // Case 4: RMA Type: Refund, Return Time: <= 15
            if (data.return_time_id === 4) {
                this.dataConfig = {
                };
            }

            // Case 5: RMA Type: Refund, Return Time: > 30
            if (data.return_time_id === 5) {
                this.dataConfig = {
                    apply_restock: { disable: true, value: 1 },
                    validate: 1
                };
            }

            // Case 5: RMA Type: Refund, Return Time: 16 - 30
            if (data.return_time_id === 6) {
                this.dataConfig = {
                    apply_restock: { disable: true, value: 1 },
                    validate: 1
                };
            }

            this.generalForm.patchValue({
                apply_restock: (this.dataConfig['apply_restock'] || {}).value,
                cover_ship: (this.dataConfig['cover_ship'] || {}).value,
                return_via: (this.dataConfig['return_via'] || {}).value
            });
        }
    }
    // Table event
    selectData(index) {
        console.log(index);
    }

    checkAll(ev, flag?) {
        this.list.items.forEach(x => {
            x['is_checked'] = (flag) ? flag : ev.target.checked;
            this.actionCheckItem(x);
        });
        this.list.checklist = this.list.items.filter(_ => _['is_checked']);
    }

    isAllChecked() {
        this.checkAllItem = this.list.items.every(_ => _['is_checked']);
        this.list.checklist = this.list.items.filter(_ => _['is_checked']);
    }

    actionCheckItem(item) {
        item.return_qty = (item.is_checked) ? item.order_quantity : 0;
    }

    /**
     * Mater Data
     */


    getListOrderByCustomer(id) {
        this.commonService.getOrderByCustomer(id).subscribe(res => {
            const data = res.data;
            this.listMaster['sales_order'] = data.order;
            this.listMaster['return_time'] = data.return_time;
            this.listMaster['rma_type'] = data.rma_type;
            this.listMaster['return_via'] = data.return_via;
            this.generalForm.patchValue({ rma_number: data.return_order_no });
        });
    }

    getListCustomer() {
        this.commonService.getAllCustomer().subscribe(res => {
            try {
                this.listMaster['customer'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getDetailCustomerById(id) {
        this.commonService.getDetailCustomer(id).subscribe(res => {
            try {
                this.customer = res.data;
                this.data['primary'] = res.data.primary[0];
            } catch (e) {
                console.log(e);
            }
        });
    }


    getListCarrier() {
        const params = { is_all: 1 };
        this.commonService.getListCarrier(params).subscribe(res => {
            this.listMaster['carrier'] = res.data;
        });
    }

    getListCoverShipFee() {
        this.listMaster['cover_ship'] = [
            { id: 1, name: 'YES' },
            { id: 2, name: 'NO' }
        ];
    }

    getListRefundMethod() {
        this.rmaService.getRefundMethod().subscribe(res => {
            this.listMaster['refund_method'] = res.data;
        });
    }

    getListPaymentTerm() {
        this.rmaService.getPaymentTerm().subscribe(res => {
            this.listMaster['payment_term'] = res.data;
        });
    }

    getListApprover() {
        this.rmaService.getApprover().subscribe(res => {
            this.listMaster['approver'] = res.data;
        });
    }

    getOrderReference(id) {
        const params = {
            type: 'data',
            order_id: id,
            request_date: this.generalForm.value.request_date
        };

        this.rmaService.getOrderReferenve(params).subscribe(res => {
            const data = res.data;
            this.list.items = data.items;
            const return_time = (this.listMaster['return_time'].find(item => item.id === data.return_time)) || {};
            this.generalForm.patchValue({
                return_time: return_time.name,
                return_time_id: return_time.id,
                receiving_date: data.receiving_date,
                status: data.status,
                warehouse: data.warehouse
            });

            this.initConfig();
            this.checkAll(null, true);
            this.updateTotal();
        });
    }

    getListReturnReason() {
        this.rmaService.getReturnReason().subscribe(res => {
            this.listMaster['reason'] = res.data;
        });
    }

    numberMaskObject(max?) {
        return createNumberMask({
            allowDecimal: true,
            includeThousandsSeparator: false,
            prefix: '',
            integerLimit: max || null
        });
    }


    /**
     * Internal Function
     */
    changeCustomer() {
        const company_id = this.generalForm.value.company_id;
        this.resetData();
        if (company_id) {
            this.getDetailCustomerById(company_id);
            this.getListOrderByCustomer(company_id);
        }
    }

    resetData() {

    }

    changeSaleOrder() {
        const id = this.generalForm.value.order_id;
        const order = this.listMaster['sales_order'].find(item => item.id === id);
        this.order_info['discount_percent'] = order['discount_percent'];
        this.order_info['vat_percent'] = order['vat_percent'];
        this.getOrderReference(id);
    }

    changeAddress(flag?) {
        if (flag === 'shipping') {
            const id = this.generalForm.value.address_id;
            this.data.shipping = this.customer['shipping'].find(item => item.address_id === id);
        }
    }

    updateTotal() {
        this.order_info['total'] = 0;
        this.order_info['sub_total'] = 0;
        this.order_info['total_order_quantity'] = 0;
        this.order_info['total_return_qty'] = 0;

        this.list.items.forEach(item => {
            item['total_refund'] = Number(item['return_qty'] || 0) * Number(item['price'] || 0);
            this.order_info['total_order_quantity'] += Number(item['order_quantity'] || 0);
            this.order_info['total_return_qty'] += Number(item['return_qty'] || 0);
            this.order_info['sub_total'] += (Number(item['price'] || 0) * Number(item['return_qty'] || 0));
        });

        this.order_info['discount_percent'] = Number(this.order_info['discount_percent'] || 0);
        this.order_info['total_discount'] = (this.order_info['sub_total'] * this.order_info['discount_percent'] / 100);

        this.order_info['vat_percent'] = Number(this.order_info['vat_percent'] || 0);
        this.order_info['vat_percent_amount'] = ((this.order_info['sub_total'] - this.order_info['total_discount']) * this.order_info['vat_percent'] / 100);
        if (this.generalForm.value.apply_restock) {
            this.order_info['restock_fee_percent'] = Number(this.order_info['restock_fee_percent'] || 0);
            this.order_info['restock_fee_amount'] = (this.order_info['sub_total'] * this.order_info['restock_fee_percent'] / 100);
        } else {
            this.order_info['restock_fee_percent'] = 0;
            this.order_info['restock_fee_amount'] = 0;
        }

        this.order_info['shipping_cost'] = Number(this.order_info['shipping_cost'] || 0);

        this.order_info['total'] = this.order_info['sub_total'] - this.order_info['total_discount'] - this.order_info['restock_fee_amount'] + ((this.generalForm.value.cover_ship) ? this.order_info['shipping_cost'] : 0)
            + this.order_info['vat_percent_amount'];
    }

    createRMA() { }
}

