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
        items: [{}],
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
            'customer_po': [null, Validators.required],
            'order_number': [null],
            'type': [null, Validators.required],
            'request_date': [ moment().format('YYYY-MM-DD'), Validators.required],
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
        this.getListCustomer();
        this.checkAll(null, true);
    }
    // Table event
    selectData(index) {
        console.log(index);
    }

    checkAll(ev, flag?) {
        this.list.items.forEach(x => x['is_checked'] = (flag) ? flag : ev.target.checked);
        this.list.checklist = this.list.items.filter(_ => _['is_checked']);
    }

    isAllChecked() {
        this.checkAllItem = this.list.items.every(_ => _['is_checked']);
        this.list.checklist = this.list.items.filter(_ => _['is_checked']);
    }


    /**
     * Mater Data
     */

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
        }
    }

    updateTotal() {

    }
}

