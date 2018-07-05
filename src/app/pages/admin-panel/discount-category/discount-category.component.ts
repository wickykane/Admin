import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';

// Services
import { TableService } from '../../../services/index';
import { DiscountCategoryService } from './discount-category.service';

@Component({
    selector: 'app-discount-category',
    templateUrl: './discount-category.component.html',
    providers: [DiscountCategoryService],
    styleUrls: ['./discount-category.component.scss'],
    animations: [routerTransition()]
})
export class DiscountCategoryComponent implements OnInit {
    public list = {
        items: []
    };
    public user: any;

    constructor(
        public tableService: TableService,
        private discountCategoryService: DiscountCategoryService
    ) {
        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
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

        this.discountCategoryService.getListWarehouse(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }
}
