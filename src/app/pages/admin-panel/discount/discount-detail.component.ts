import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { TableService } from '../../../services/index';
import { DiscountService } from './discount.service';

@Component({
    selector: 'app-discount-detail',
    templateUrl: './discount-detail.component.html',
    styleUrls: ['./discount.component.scss'],
    providers: [DiscountService],
    animations: [routerTransition()]
})
export class DiscountDetailComponent implements OnInit {
    public discount: any = [];
    public list = {
        items: [],
        status: []
    };
    public flagBaseDiscount = true;
    public flagReturnRate = true;
    public flagConsolidatedDiscount = true;

    constructor(
        public tableService: TableService,
        private discountService: DiscountService,
        public router: Router,
        public route: ActivatedRoute,
        private toastr: ToastrService
    ) {}

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

                this.list['base_discount'] = [
                    {
                        base_discount_levels: 1,
                        discount: 20,
                        min_gross_purchase: 0
                    },
                    {
                        base_discount_levels: 2,
                        discount: 25,
                        min_gross_purchase: 20000
                    },
                    {
                        base_discount_levels: 3,
                        discount: 30,
                        min_gross_purchase: 30000
                    }
                ];

                this.list['return_rate'] = [
                    {
                        return_rate_level: 1,
                        discount_adjustment: '+ 5.00',
                        from_return_rate: 1,
                        to_return_rate: 5
                    },
                    {
                        return_rate_level: 2,
                        discount_adjustment: '+ 2.50',
                        from_return_rate: 5,
                        to_return_rate: 10
                    }
                ];

                this.list['consolidated_discount_rate'] = [
                    {
                        discount_level: 1,
                        discount_adjustment: '+ 0.00',
                        min_gross_purchase: 0
                    },
                    {
                        discount_level: 2,
                        discount_adjustment: '+ 2.50',
                        min_gross_purchase: 50000
                    },
                    {
                        discount_level: 3,
                        discount_adjustment: '+ 5.00',
                        min_gross_purchase: 100000
                    }
                ];
            } catch (e) {}
        });
    }

    convertStatus(id) {
        const stt = this.list.status.find(item => item.id === id);
        return stt.name;
    }
}
