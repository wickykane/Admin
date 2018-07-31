import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
            'buyer': [null, Validators.required],
            'rma_number': [null, Validators.required],
            'rma_type': [1, Validators.required],
            'request_date': [moment().format('YYYY-MM-DD'), Validators.required],
            'order_id': [null, Validators.required],
            'return_via': [null, Validators.required],
            'carrier': [null, Validators.required],
            'cover_ship': ['Yes', Validators.required],
            'apply_restock': [0],
            'refund_method': [null, Validators.required],
            'payment_term': [null],
            'approver': [null,Validators.required],
            'address_id': [null],
            'note': [null],
            'contact_name': [null],
            'email': [null],
            'phone': [null],
            // Extra data
            'return_time': [null],
            'receiving_date': [null],
            'warehouse': [null],
            'warehouseName': [null],
            'status': [null],
            'rma_items': this.fb.array([]),
            'total_amount': [null],
            'ship_fee': [null],
            'discount': [null],
            'tax': [null],
            'restocking_fee_percent': [null],
            'restocking_fee': [null],
            'sub_total': [null],
            'return_time_name': [null]

        });

        //  Init Key
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        this.getListCustomer();
        this.checkAll(null, true);

        // Master Data Init
        this.getListMasterData();
        // this.getListRefundMethod();
        // this.getListPaymentTerm();
        // this.getListCoverShipFee();
        // this.getListCarrier();
        // this.getListApprover();
        // this.getListReturnReason();

        this.updateTotal();

        // Change form data event handle
        this.generalForm.get('return_via').valueChanges.subscribe(data => {
            if (data == 1 || data == 2) {
                this.generalForm.get('carrier').setValidators(Validators.required);
                this.generalForm.get('address_id').setValidators(Validators.required);
            } else {
                this.generalForm.get('carrier').clearValidators();
                this.generalForm.get('address_id').clearValidators();
            }
            this.generalForm.patchValue({ carrier: null });
        });

        this.initConfig();
    }

    // Disable Config
    initConfig() {
        const data = this.generalForm.value;
        if (this.generalForm.value.rma_type === 1) {
            // Case 1: RMA Type: Refund, Return Time: During WH Pickup, Receiving Date: Not yet received
            console.log(data);
            if (data.return_time === 1 && data.receiving_date === 'Not yet received') {
                this.dataConfig = {
                    carrier: 1,
                    cover_ship: 'No',
                    return_via: 4,
                    apply_restock: 0,
                };
            }
            // Case 2: RMA Type: Refund, Return Time: Before Delivery
            if (data.return_time === 2) {
                this.dataConfig = {
                    carrier: 5,
                    cover_ship: 'Yes',
                    return_via: 4,
                    apply_restock: 0,
                };
            }

            // Case 3: RMA Type: Refund, Return Time: At Delivery
            if (data.return_time === 3) {
                this.dataConfig = {
                    cover_ship: 'Yes',
                    apply_restock: 0,
                };
            }

            // Case 4: RMA Type: Refund, Return Time: <= 15
            if (data.return_time === 4) {
                this.dataConfig = {
                    cover_ship: 'Yes',
                    apply_restock: 0,
                };
            }

            // Case 5: RMA Type: Refund, Return Time: > 30
            if (data.return_time === 5) {
                this.dataConfig = {
                    cover_ship: 'Yes',
                    apply_restock: 1,
                    validate: 1
                };
            }

            // Case 5: RMA Type: Refund, Return Time: 16 - 30
            if (data.return_time === 6) {
                this.dataConfig = {
                    cover_ship: 'Yes',
                    apply_restock: 1,
                    validate: 1
                };
            }
            if (data.return_time === null) {
                this.dataConfig = {
                    cover_ship: 'Yes'
                };
            }

            this.generalForm.patchValue({
                apply_restock: this.dataConfig['apply_restock'],
                cover_ship: this.dataConfig['cover_ship'],
                return_via: this.dataConfig['return_via']
            });

        }
    }
    // Table event
    selectData(index) {
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
            // this.listMaster['sales_order'] = data.order;
            // this.listMaster['return_time'] = data.return_time;
            this.listMaster['sales_order'] = data.order;
            // this.listMaster['rma_type'] = data.rma_type;
            // this.listMaster['return_via'] = data.return_via;
            this.generalForm.patchValue({ rma_number: data.return_order_no });
        });
    }
    getListMasterData() {
        this.commonService.getMasterData().subscribe(res => {
            const data = res.data;

            this.listMaster['return_time'] = data.return_time;
            this.listMaster['rma_type'] = data.rma_type;
            this.listMaster['return_via'] = data.return_via;
            this.listMaster['approver'] = data.approver;
            this.listMaster['payment_term'] = data.payment_term;
            this.listMaster['refund_method'] = data.refund_method;
            this.listMaster['carrier'] = data.carrier;
            this.listMaster['cover_ship'] = data.cover_ship_fee;
            this.listMaster['reason'] = data.return_reason;
            // this.generalForm.patchValue({ rma_number: data.return_order_no });
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


    // getListCarrier() {
    //     const params = { is_all: 1 };
    //     this.commonService.getListCarrier(params).subscribe(res => {
    //         this.listMaster['carrier'] = res.data;
    //     });
    // }

    // getListCoverShipFee() {
    //     this.listMaster['cover_ship'] = [
    //         { id: 1, name: 'YES' },
    //         { id: 2, name: 'NO' }
    //     ];
    // }

    // getListRefundMethod() {
    //     this.rmaService.getRefundMethod().subscribe(res => {
    //         this.listMaster['refund_method'] = res.data;
    //     });
    // }

    // getListPaymentTerm() {
    //     this.rmaService.getPaymentTerm().subscribe(res => {
    //         this.listMaster['payment_term'] = res.data;
    //     });
    // }

    // getListApprover() {
    //     this.rmaService.getApprover().subscribe(res => {
    //         this.listMaster['approver'] = res.data;
    //     });
    // }

    getOrderReference(id) {
        // const params = {
        //     type: 'data',
        //     order_id: id,
        //     request_date: this.generalForm.value.request_date
        // };

        // this.rmaService.getOrderReferenve(params).subscribe(res => {
        //     const data = res.data;
        //     this.list.items = data.items;
        //     const return_time = (this.listMaster['return_time'].find(item => item.id === data.return_time)) || {};
        //     this.generalForm.patchValue({
        //         return_time: return_time.name,
        //         receiving_date: data.receiving_date,
        //         status: data.status,
        //         warehouse: data.warehouse
        //     });
        //     this.checkAll(null, true);
        //     this.updateTotal();
        // });
        this.rmaService.getOrderInfo(id).subscribe(res => {
            const data = res.data;
            console.log(res.data);
            this.list.items = data.items;
            const return_time = (this.listMaster['return_time'].find(item => item.id === data.return_time)) || {};
            this.generalForm.patchValue({
                return_time: return_time.id,
                return_time_name: return_time.name,
                receiving_date: data.receiving_date,
                status: data.status,
                warehouseName: data.warehouse,
                warehouse: data.warehouse_id
            });
            this.initConfig();
            this.checkAll(null, true);
            this.updateTotal();
        });
    }

    // getListReturnReason() {
    //     this.rmaService.getReturnReason().subscribe(res => {
    //         this.listMaster['reason'] = res.data;
    //     });
    // }

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
        const buyer = this.generalForm.value.buyer;
        this.resetData();
        if (buyer) {
            this.getDetailCustomerById(buyer);
            this.getListOrderByCustomer(buyer);
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
            this.data.shipping = this.customer['shipping'].find(item => item.id === id);
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
        console.log(this.generalForm.value['cover_ship']);
        if(this.generalForm.value['cover_ship']=='Yes'){
            this.order_info['shipping_cost'] = Number(this.order_info['shipping_cost'] || 0);
        }
        else{
            this.order_info['shipping_cost'] =  0;
        }


        this.order_info['total'] = this.order_info['sub_total'] - this.order_info['total_discount'] - this.order_info['restock_fee_amount'] + ((this.generalForm.value.cover_ship) ? this.order_info['shipping_cost'] : 0)
            + this.order_info['vat_percent_amount'];
        this.generalForm.patchValue({
            total_amount: this.order_info['total'],
            ship_fee: this.order_info['shipping_cost'],
            discount: this.order_info['discount_percent'],
            tax: this.order_info['vat_percent'],
            restocking_fee: this.order_info['restock_fee_amount'],
            restocking_fee_percent: this.order_info['restock_fee_percent'],
            sub_total: this.order_info['sub_total']
        });
    }

    createRMA() {
        var rma_item =[];
        var rmaObject = this.generalForm.value;
        var list= this.list['items'].slice(0);
        console.log(list);
        list.forEach(item=>{
            rma_item.push({
                'return_reason':item.return_reason,
                'return_qty':item.return_qty,
                'order_detail_id':item.id
            })
        });
        rmaObject['rma_items']=rma_item;
        rmaObject['status'] = 1;
        delete rmaObject['return_time'];
        console.log(rmaObject);
        // this.generalForm.patchValue({
        //     rma_items: this.list['items'],
        //     status:1
        // });
        // console.log(this.generalForm.value);
        this.rmaService.createRMA(this.generalForm.value).subscribe(res => {
            this.toastr.success(res.message);
            setTimeout(() => {
                this.router.navigate(['/rma']);
            }, 500);
        },err=>{
            if(err){
                if(err.data.return_reason){
                    this.toastr.error('Return Reason is required');
                }
            }
        });


    }
    checkApplyRestock(isCheck){

        var val= isCheck?1:0;
        console.log(val);
        this.generalForm.patchValue({
            apply_restock:val
        });
    }
}

