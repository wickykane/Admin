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
        items: [{ order_quantity: 100, sale_price: 125 }],
        checklist: []
    };
    public checkAllItem = true;
    customer = {};
    order_info = {};
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
            'type': [null, Validators.required],
            'request_date': [moment().format('YYYY-MM-DD'), Validators.required],
            'sales_order_id': [null, Validators.required],
            'return_via': [null, Validators.required],
            'carrier_id': [null, Validators.required],
            'cover_ship_fee': [null, Validators.required],
            'restock_fee': [null],
            'refund_method': [null, Validators.required],
            'payment_term': [null],
            'approver': [null],
            'billing_id': [null],
            'shipping_id': [null],
            'note': [null],
            'contact_name': [null],
            'contact_email': [null],
            'contact_phone': [null],
        });

        //  Init Key
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        this.getListCustomer();
        this.checkAll(null, true);

        // Master Data Init
        this.getRMACode();
        this.getListRMAType();
        this.getListReturnVia();
        this.getListRefundMethod();
        this.getListPaymentTerm();
        this.getListCoverShipFee();
        this.getListCarrier();
        this.getListApprover();
        this.getListReturnReason();

        this.updateTotal();

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
        item.return_quantity = (item.is_checked) ? item.order_quantity : 0;
    }

    /**
     * Mater Data
     */
    getRMACode() {
        this.rmaService.getRMACode().subscribe(res => {
            this.order_info['code'] = res.data;
        });
    }

    getListRMAType() {
        this.rmaService.getRMAType().subscribe(res => {
            const list = [
                { id: 1, name: 'Refund' },
                { id: 2, name: 'Exchange' }
            ];
            this.listMaster['rma_type'] = list || res.data;
        });
    }

    getListOrderByCustomer(id) {
        this.commonService.getOrderByCustomer(id).subscribe(res => {
            this.listMaster['sales_order'] = res.data;
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

    getListReturnVia() {
        this.rmaService.getRMAReturnVia().subscribe(res => {
            this.listMaster['return_via'] = res.data;
        });
    }

    getListCarrier() {
        this.commonService.getListCarrier().subscribe(res => {
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
        this.rmaService.getOrderReferenve(id).subscribe(res => {
            this.listMaster['order_reference'] = res.data;
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
            prefix: '',
            integerLimit: max || null
        });
    }


    /**
     * Internal Function
     */
    changeCustomer() {
        const company_id = this.generalForm.value.company_id;
        if (company_id) {
            this.getDetailCustomerById(company_id);
            this.getListOrderByCustomer(company_id);
        }
    }

    changeSaleOrder() {
        const id = this.generalForm.value.order_number;
        this.getOrderReference(id);
    }

    changeAddress(flag?) {
        if (flag === 'shipping') {
            const id = this.generalForm.value.shipping_id;
            this.data.shipping = this.customer['shipping'].find(item => item.address_id === id);
        }
    }

    updateTotal() {
        this.order_info['total'] = 0;
        this.order_info['sub_total'] = 0;
        this.order_info['total_order_quantity'] = 0;
        this.order_info['total_return_quantity'] = 0;

        this.list.items.forEach(item => {
            item['total_refund'] = Number(item['return_quantity'] || 0) * Number(item['sale_price'] || 0);
            this.order_info['total_order_quantity'] += Number(item['order_quantity'] || 0);
            this.order_info['total_return_quantity'] += Number(item['return_quantity'] || 0);
            this.order_info['sub_total'] += (Number(item['sale_price'] || 0) * Number(item['return_quantity'] || 0));
        });

        this.order_info['discount_percent'] = Number(this.order_info['discount_percent'] || 0);
        this.order_info['total_discount'] = (this.order_info['sub_total'] * this.order_info['discount_percent'] / 100);

        this.order_info['vat_percent'] = Number(this.order_info['vat_percent'] || 0);
        this.order_info['vat_percent_amount'] = ((this.order_info['sub_total'] - this.order_info['total_discount']) * this.order_info['vat_percent'] / 100);

        this.order_info['restock_fee_percent'] = Number(this.order_info['restock_fee_percent'] || 0);
        this.order_info['restock_fee_amount'] = (this.order_info['sub_total'] * this.order_info['restock_fee_percent'] / 100);

        this.order_info['shipping_cost'] = Number(this.order_info['shipping_cost'] || 0);

        this.order_info['total'] = this.order_info['sub_total'] - this.order_info['total_discount'] + this.order_info['shipping_cost'] + this.order_info['vat_percent_amount'];
        console.log(  this.order_info['total']);
    }

    createRMA() { }
}

