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
    public listStatus = [];
    public listType = [];
    public listApplyType = [];
    public listSubCategory = [];
    public list = {
        categories: []
    };
    public user: any;
    public crt_dt: any;

    constructor(
        public fb: FormBuilder,
        public tableService: TableService,
        private discountService: DiscountService,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.generalForm = fb.group({
            code_id: [{ value: null, disabled: true }],
            description: [null],
            start_dt: [null, Validators.required],
            status: [1, Validators.required]
        });
    }

    ngOnInit() {
        this.user = JSON.parse(localStorage.getItem('currentUser'));
        this.crt_dt = moment().format('YYYY-MM-DD');
        this.listStatus = [
            {
                id: 1,
                name: 'Active'
            },
            {
                id: 0,
                name: 'Inactive'
            }
        ];
        this.listType = [
            {
                id: 'fe',
                name: 'Fender'
            },
            {
                id: 'ho',
                name: 'Hood'
            }
        ];
        this.listApplyType = [
            {
                id: 'all',
                name: 'All'
            },
            {
                id: 'spe',
                name: 'Specific'
            }
        ];
        this.listSubCategory = [
            {
                id: 'lr',
                name: 'Left, Right'
            },
            {
                id: 'fb',
                name: 'Front, Back'
            }
        ];
    }

    getListType() {
        this.discountService.getListType().subscribe(res => {
            try {
                this.list['listType'] = res.data;
            } catch (e) {}
        });
    }
    getListApplyType(item) {
        const params = {
            type_id: item.type_id
        };
        this.discountService.getListApplyType(params).subscribe(res => {
            try {
                this.list['listApplyType'] = res.data;
            } catch (e) {}
        });
    }
    getListSubCategory(item) {
        const params = {
            type_id: item.type_id,
            sub_category_id: item.sub_category_id
        };
        this.discountService.getListSubCategory(params).subscribe(res => {
            try {
                this.list['listSubCategory'] = res.data;
            } catch (e) {}
        });
    }

    addNewCategory() {
        this.list.categories.push({
            // category_id: 'fe',
            value: 0,
            listType: this.listType,
            listApplyType: this.listApplyType,
            listSubCategory: this.listSubCategory
        });
        console.log(this.list.categories);
    }
    removeCategory(index) {
        this.list.categories.splice(index, 1);
    }
    saveDiscount() {
        const data = {
            data: JSON.stringify(this.list.categories)
        };
        this.discountService.saveDiscount(data).subscribe(
            res => {
                console.log(res);
                try {
                    setTimeout(() => {
                        this.router.navigate(['/admin-panel']);
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
