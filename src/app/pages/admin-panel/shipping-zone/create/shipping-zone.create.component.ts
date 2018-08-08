import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { ShippingZoneService } from '../shipping-zone.service';
import { RMACreateKeyService } from './keys.control';

import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { routerTransition } from '../../../../router.animations';
import { CommonService } from './../../../../services/common.service';

import * as moment from 'moment';

@Component({
    selector: 'app-create-shipping-zone',
    templateUrl: './shipping-zone.create.component.html',
    styleUrls: ['../shipping-zone.component.scss'],
    animations: [routerTransition()],
    providers: [DatePipe, RMACreateKeyService, CommonService]
})

export class ShippingZoneCreateComponent implements OnInit {
    /**
     * Variable Declaration
     */
    public generalForm: FormGroup;
    public listMaster = {};
    public listShipping = [];
    public listMasterData ={};
    constructor(
        public keyService: RMACreateKeyService,
        private vRef: ViewContainerRef,
        private fb: FormBuilder,
        public toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private shippingZoneService: ShippingZoneService,
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
        this.getListMasterData();
    }
    getListMasterData(){
        this.shippingZoneService.getMasterData().subscribe(res => {
            this.listMasterData = res.data;
            this.listShipping =res.data["shipping_quotes_type"];
            console.log(this.listShipping);
        })
    }










}

