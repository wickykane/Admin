import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { TableService } from '../../../services/index';
import { DiscountService } from './discount.service';

@Component({
    selector: 'app-discount',
    templateUrl: './discount.component.html',
    styleUrls: ['./discount.component.scss'],
    providers: [DiscountService],
    animations: [routerTransition()]
})
export class DiscountComponent implements OnInit {
    generalForm: FormGroup;
    public flagCategory = true;
    public listSearchStatus = [];

    public list = {
        items: [],
        status: []
    };

    constructor(
        public fb: FormBuilder,
        public tableService: TableService,
        private discountService: DiscountService,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.generalForm = fb.group({
            name: [null, Validators.required],
            dt_from: [null, Validators.required],
            dt_to: [null, Validators.required],
            status: [1, Validators.required]
        });

        //  Assign get list function name, override variable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        //  Init Key
        // this.itemKeyService.watchContext.next(this);
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
        this.getList();
    }

    getList() {
        const params = {
            ...this.tableService.getParams(),
            ...this.generalForm.value,
        };
        Object.keys(params).forEach(
            key =>
                (params[key] === null || params[key] === '') &&
                delete params[key]
        );
        this.discountService.getListDiscounts(params).subscribe(res => {
            try {
                // this.list.items = res.data;
                this.list.items = [
                    {
                        id: 1,
                        name: 'Discount & Return Rate 3',
                        start_dt: moment().format('YYYY-MM-DD'),
                        status: 1,
                        base_discount_levels: 6,
                        return_rate_levels: 6,
                        consol_discount_levels: 5
                    },
                    {
                        id: 2,
                        name: 'Discount & Return Rate 3',
                        start_dt: moment().format('YYYY-MM-DD'),
                        status: 2,
                        base_discount_levels: 6,
                        return_rate_levels: 6,
                        consol_discount_levels: 5
                    },
                    {
                        id: 3,
                        name: 'Discount & Return Rate 3',
                        start_dt: moment().format('YYYY-MM-DD'),
                        status: 3,
                        base_discount_levels: 6,
                        return_rate_levels: 6,
                        consol_discount_levels: 5
                    },
                    {
                        id: 4,
                        name: 'Discount & Return Rate 3',
                        start_dt: moment().format('YYYY-MM-DD'),
                        status: 2,
                        base_discount_levels: 6,
                        return_rate_levels: 6,
                        consol_discount_levels: 5
                    }
                ];
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

    convertStatus(id) {
        const stt = this.list.status.find(item => item.id === id);
        return stt.name;
    }
    reset() {
        this.generalForm.reset();
    }
    cloneItem(item) {
        this.list.items.push(item);
    }
    removeItem(index) {
        this.list.items.splice(index, 1);
    }
}
