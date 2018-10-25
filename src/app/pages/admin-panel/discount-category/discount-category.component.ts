import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotkeysService } from 'angular2-hotkeys';
import { routerTransition } from '../../../router.animations';
// Services
import { TableService } from '../../../services/index';
import { StorageService } from '../../../services/storage.service';
import { cdArrowTable } from '../../../shared';
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

    @ViewChild(cdArrowTable) table: cdArrowTable;
    constructor(
        private cd: ChangeDetectorRef,
        private activeRouter: ActivatedRoute,
        private router: Router,
        private _hotkeysService: HotkeysService,
        public keyService: DiscountCategoryKeyService,
        public tableService: TableService,
        private storage: StorageService,
        private discountCategoryService: DiscountCategoryService
    ) {
        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        // this.keyService.watchContext.next(this);
         //  Init Key
         this.listMaster['permission'] = this.storage.getRoutePermission(this.router.url);
         this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    ngOnInit() {
        this.getList();
        this.user = JSON.parse(localStorage.getItem('currentUser'));
    }

    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
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
    editDiscountCategory() {
        const id = this.list.items[this.selectedIndex].id;
        this.router.navigate(['/admin-panel/discount-category/edit', id]);
    }
    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td button').focus();
    }
}
