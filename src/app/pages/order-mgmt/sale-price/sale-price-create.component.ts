import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { OrderService } from "../order-mgmt.service";

import { ToastsManager } from 'ng2-toastr/ng2-toastr';


@Component({
    selector: 'app-sale-price-create',
    templateUrl: './sale-price-create.component.html',
    styleUrls: ['./sale-price.component.scss'],
    providers: [OrderService]

})

export class SalePriceCreateComponent implements OnInit {
    /**
     * Variable Declaration
     */
    public generalForm: FormGroup;
    public listMaster = {};
    public data = {};
    public all_customer_type = '1';
    /**
     * Init Data
     */
    constructor(private vRef: ViewContainerRef, private fb: FormBuilder, private orderService: OrderService, public toastr: ToastsManager, private router: Router, private modalService: NgbModal) {
        this.toastr.setRootViewContainerRef(vRef);
        this.generalForm = fb.group({
            'cd': [{ value: null, disabled: true }],
            'name': [null],
            'sts': [null, Validators.required],
            'apply_for': [null, Validators.required],
            'crtd_on': [new Date(), Validators.required],
        });
    }

    ngOnInit() {

        this.data['segmentList'] = [];

        //Master Data
      
    }

    /**
     * Internal Function
     */
    clickAdd = function () {
        this.data.segmentList.push({ 'has_specific_customer': false });
    };

    remove = function (index) {
        this.data.segmentList.splice(index, 1);
    };    

    changeToGetCustomer = function (segment, index) {

        let params = { 'type': segment.type, 'country_code': segment.country_code }
        Object.keys(params).forEach(function (item) {
            if ((params[item]) instanceof Array) {
                params[item] = params[item].join(',');
            }
            return item;
        });

        this.promotionService.getCustomerSegment(params).subscribe(res => {
            try {
                this.data.segmentList[index].customerList = res.results;
            } catch (e) {
                console.log(e);
            }
        })
    }

    checkCustomerList = function (segment) {
        setTimeout(() => {
            if (!segment.customers) return;
            if (segment.customers.length > 0) {
                segment.has_specific_customer = true;
            } else {
                segment.has_specific_customer = false;
            }
        })
    }

    createSegment = function () {
        let params = this.generalForm.value;
        params.detail = Array.from( this.data.segmentList);

        this.promotionService.postSegment(params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                setTimeout(() => {
                    this.router.navigate(['/customer/customer-segment']);
                }, 500)
            } catch (e) {
                console.log(e)
            }
        },
            err => {
                this.toastr.error(err.message, null, { enableHTML: true });
            })
    }
}
