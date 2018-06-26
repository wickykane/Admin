import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PromotionService } from '../../promotion-mgmt/promotion.service';
import { CustomerService } from '../customer.service';

import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-customer-segment',
    templateUrl: './customer-segment.edit.component.html',
    styleUrls: ['./customer-segment.component.scss'],
    providers: [PromotionService]

})

export class CustomerSegmentEditComponent implements OnInit {
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
    constructor(private fb: FormBuilder,
        private promotionService: PromotionService,
        private customerService: CustomerService,
        public toastr: ToastrService,
        private router: Router,
        private modalService: NgbModal,
        private route: ActivatedRoute) {

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

        this.listMaster['applyFor'] = [{
            id: '1',
            name: 'All customers'
        }, {
            id: '2',
            name: 'Specific Customers '
        }];

        this.listMaster['status'] = [{
            id: 'IA',
            name: 'In-Active'
        }, {
            id: 'AT',
            name: 'Active '
        }];

        this.listMaster['allType'] = [
            {
                id: '1',
                name: 'All customers '
            },

        ];

        this.data['id'] = this.route.snapshot.paramMap.get('id');
        this.getDetailSegment(this.data['id']);
    }

    /**
     * Internal Function
     */
    getDetailSegment(id) {
        this.getListCountry();
        this.getListBuyerType();
        this.promotionService.getDetailSegment(id).subscribe(res => {
            try {
                if (res._type ===  'success') {
                    this.generalForm.patchValue(res.results);
                    this.data['segmentList'] = res.results.detail || [];
                    this.data['segmentList'].forEach((data, index) => {
                        this.changeToGetCustomer(data, index);
                    });
                } else {
                    this.toastr.error(res.message);
                }

            } catch (e) {
                console.log(e);
            }
        });

    }

    clickAdd = function () {
        this.data.segmentList.push({ 'has_specific_customer': false });
    };

    remove = function (index) {
        this.data.segmentList.splice(index, 1);
    };

    getListCountry() {
        this.customerService.getListCountry().subscribe(res => {
            try {
                this.listMaster['countries'] = res.results;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getListBuyerType() {
        this.customerService.getListBuyerType().subscribe(res => {
            try {
                this.listMaster['customerType'] = res.results;
            } catch (e) {
                console.log(e);
            }
        });
    }

    changeToGetCustomer = (segment, index) => {
        const params = { 'type': segment.company_type_id, 'country_code': segment.country_code };
        Object.keys(params).forEach((item)  => {
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
        });
    }

    checkCustomerList = (segment) => {
        setTimeout(() => {
            if (!segment.customers) { return; }
            if (segment.customers.length > 0) {
                segment.has_specific_customer = true;
            } else {
                segment.has_specific_customer = false;
            }
        });
    }

    createSegment = function () {
        const params = this.generalForm.value;
        params.detail = Array.from(this.data.segmentList);

        params.detail.forEach(item => {
            item.customers.forEach((cus, index) => {
                item.customers[index] = cus.id;
            });
        });


        this.promotionService.postSegment(params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                setTimeout(() => {
                    this.router.navigate(['/customer/customer-segment']);
                }, 500);
            } catch (e) {
                console.log(e);
            }
        },
            err => {
                this.toastr.error(err.message);
            });
    };
}
