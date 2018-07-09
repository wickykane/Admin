import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { TableService } from '../../../services/index';
import { DiscountService } from './discount.service';

@Component({
    selector: 'app-discount-create',
    templateUrl: './discount-create.component.html',
    styleUrls: ['./discount.component.scss'],
    providers: [DiscountService],
    animations: [routerTransition()]
})
export class DiscountCreateComponent implements OnInit {
    generalForm: FormGroup;

    public discount: any = [];
    public list = {
        items: [],
        status: []
    };
    public flagBaseDiscount = true;
    public flagReturnRate = true;
    public flagConsolidatedDiscount = true;

    constructor(
        public fb: FormBuilder,
        public tableService: TableService,
        private discountService: DiscountService,
        public router: Router,
        public route: ActivatedRoute,
        private toastr: ToastrService
    ) {
        this.generalForm = fb.group({
            name: [null, Validators.required],
            from_dt: [null, Validators.required],
            from_time: [{ hour: 13, minute: 30, second: 0 }],
            duration: [null, Validators.required],
            durationType: [1, Validators.required],
            approve: [1, Validators.required]
        });
    }

    test() {
        console.log('before: ', this.generalForm.value);
        this.generalForm.value.from_time = { hour: 20, minute: 45 };
        console.log('after: ', this.generalForm.value);
    }

    ngOnInit() {
        this.list.status = [
            {
                id: 1,
                name: 'Active'
            },
            {
                id: 2,
                name: 'Inactive'
            },
            {
                id: 3,
                name: 'Closed'
            },
            {
                id: 4,
                name: 'All'
            }
        ];
        this.list['durationType'] = [
            {
                id: 1,
                name: 'Weeks'
            },
            {
                id: 2,
                name: 'Months'
            },
            {
                id: 3,
                name: 'Year'
            }
        ];

        this.list['approveList'] = [
            {
                id: 1,
                name: '1'
            },
            {
                id: 2,
                name: '2'
            },
            {
                id: 3,
                name: '3'
            }
        ];

        this.list['discountAdjustmentType'] = [
            {
                id: 1,
                name: '+'
            },
            {
                id: 2,
                name: '-'
            }
        ];
        this.route.params.subscribe(params =>
            this.getDetailDiscount(params.id)
        );
    }

    getDetailDiscount(id) {
        this.discountService.getDetailDiscount(id).subscribe(res => {
            try {
                this.discount = {
                    id: 4,
                    name: 'Discount & Return Rate 3',
                    start_dt: moment().format('YYYY-MM-DD'),
                    start_time: moment().format('h:mm a'),
                    status: 2
                };

                this.list['base_discount'] = [];
                this.list['return_rate'] = [];
                this.list['consolidated_discount_rate'] = [];
            } catch (e) {}
        });
    }

    convertStatus(id) {
        const stt = this.list.status.find(item => item.id === id);
        return stt.name;
    }
    removeBaseDiscount(index) {
        this.list['base_discount'].splice(index, 1);
    }
    addBaseDiscount() {
        const item = {
            discount: 0,
            min_gross_purchase: 0
        };
        this.list['base_discount'].push(item);
    }

    removeReturnRate(index) {
        this.list['return_rate'].splice(index, 1);
    }
    addReturnRate() {
        const item = {
            discount_adjustment_type: 1,
            discount_adjustment: 5,
            from_return_rate: 1,
            to_return_rate: 5
        };
        this.list['return_rate'].push(item);
    }

    removeConsolDiscount(index) {
        this.list['consolidated_discount_rate'].splice(index, 1);
    }
    addConsolDiscount() {
        const item = {
            discount_adjustment: 0,
            min_gross_purchase: 0
        };
        this.list['consolidated_discount_rate'].push(item);
    }

    saveAll() {
        if (this.generalForm.valid) {
            const params = {
                ...this.generalForm.value,
                ...{ base_discount: this.list['base_discount'] },
                ...{ return_rate: this.list['return_rate'] },
                ...{
                    consolidated_discount_rate: this.list[
                        'consolidated_discount_rate'
                    ]
                }
            };

            const data = {
                data: JSON.stringify(params)
            };

            this.discountService.saveDiscount(data).subscribe(
                res => {
                    console.log(res);
                    try {
                        setTimeout(() => {
                            this.router.navigate(['/admin-panel/discount']);
                        }, 2000);
                        this.toastr.success(res.message);
                    } catch (e) {
                        console.log(e);
                    }
                },
                err => {
                    console.log(err);
                    this.toastr.error(err.message);
                }
            );
        }
    }
}
