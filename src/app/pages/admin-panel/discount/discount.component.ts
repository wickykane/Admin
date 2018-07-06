import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
    public list = {
        items: [],
        status: [
            {
                id: 1,
                name: 'Active'
            },
            {
                id: 0,
                name: 'Inactive'
            }
        ]
    };
    public user: any;

    constructor(
        public fb: FormBuilder,
        public tableService: TableService,
        private discountService: DiscountService
    ) {
        this.generalForm = fb.group({
            code_id: [{ value: null, disabled: true }],
            description: [null],
            start_dt: [null, Validators.required],
            status: [1, Validators.required]
        });
    }

    ngOnInit() {
        this.getList();
        this.user = JSON.parse(localStorage.getItem('currentUser'));
    }

    getList() {
        const params = {
            ...this.tableService.getParams()
        };
        Object.keys(params).forEach(
            key =>
                (params[key] === null || params[key] === '') &&
                delete params[key]
        );

        this.discountService.getListDiscount(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }
}
