import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { routerTransition } from '../../../router.animations';

// Services
import { TableService } from '../../../services/index';
import { DiscountCategoryService } from './discount-category.service';
import { DiscountCategoryKeyService } from './keys.control';

@Component({
    selector: 'app-discount-category',
    templateUrl: './discount-category.component.html',
    providers: [DiscountCategoryService, DiscountCategoryKeyService],
    styleUrls: ['./discount-category.component.scss'],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountCategoryComponent implements OnInit {
    public list = {
        items: []
    };
    public user: any;
    public flagAddress: boolean;
    public listMaster = {};
    public selectedIndex = 0;


    constructor(
        private cd: ChangeDetectorRef,
        private activeRouter: ActivatedRoute,
        private router: Router,
        public keyService: DiscountCategoryKeyService,
        public tableService: TableService,
        private discountCategoryService: DiscountCategoryService
    ) {
        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        this.getList();
        this.user = JSON.parse(localStorage.getItem('currentUser'));
    }

    refresh() {
        this.cd.detectChanges();
    }

    selectData(index) {
      console.log(index);
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

        this.discountCategoryService.getListDiscountCategory(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    createDiscountCategory() {
        this.router.navigate(['/admin-panel/discount-category/create']);
    }
}
