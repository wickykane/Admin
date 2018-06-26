import { TableService } from './../../../services/table.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product-mgmt.service';
import { ItemKeyService } from './keys.control';
import { NgbTab } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.scss'],
    providers: [ItemKeyService]
})
export class ItemListComponent implements OnInit {

    /**
     * Variable Declaration
     */
    public searchForm: FormGroup;
    public filterForm: FormGroup;

    public listMaster = {};
    public selectedIndex = 0;
    public list = {
        items: [],
        checklist: []
    };
    public checkAllItem;
    public data = {};
    @ViewChild('tabSet') tabSet;

    /**
     * Init Data
     */

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public tableService: TableService,
        public itemKeyService: ItemKeyService,
        private productService: ProductService
    ) {
        this.searchForm = fb.group({
            'warehouse': [null],
            'cd': [null],
            'name': [null],
            'sts': [null],
            'vin': [null],
            'year': [null],
            'manufacturer_id': [null],
            'model_id': [null],
            'sub_model_id': [null],
            'oem': [null],
            'partlinks_no': [null],
            'part_no': [null],
            'certification': [null],
        });

        this.filterForm = fb.group({
            'brand_id_filter': [null],
            'category_id_filter': [null],
            'sub_category_id': [null],
            'certification_filter': [null],
            'oem_filter': [null],
            'partlinks_no_filter': [null],
            'part_no_filter': [null],
            'country_id_filter': [null],
            'manufacturer_id_filter': [null]
        });

        //  Assign get list function name, override variable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        //  Init Key
        this.itemKeyService.watchContext.next(this);
    }

    ngOnInit() {

        //  Init Fn
        this.listMaster['certification_partNumber'] = [{ code: 'Y', value: 'Yes' }, { code: 'N', value: 'No' }];
        this.getListWarehouse();
        this.getListReference();
    }
    /**
     * Master Data
     */

    getListWarehouse() {
        this.productService.getListWarehouse().subscribe(res => {
            try {
                this.listMaster['warehouses'] = res.data;
            } catch (e) {
                console.log(e.message);
            }
        });
    }

    getListReference() {
        this.productService.getReferList().subscribe(res => {
            try {
                this.listMaster['models'] = res.data.models;
                this.listMaster['years'] = res.data.years.map((e) => ({id: e, name: e }));
                this.listMaster['make'] = res.data.manufacturers;
            } catch (e) {
                console.log(e.message);
            }
        });

    }

    /**
     * Table Event
     */
    selectData(index) {
        console.log(index);
    }

    checkAll(ev) {
        this.list.items.forEach(x => x.is_checked = ev.target.checked);
        this.list.checklist = this.list.items.filter(_ => _.is_checked);
    }

    isAllChecked() {
        this.checkAllItem = this.list.items.every(_ => _.is_checked);
        this.list.checklist = this.list.items.filter(_ => _.is_checked);
    }

    /**
     * Internal Function
     */

    selectTab(id) {
        this.tabSet.select(id);
    }

    resetTab() {
        this.searchForm.reset();
        this.filterForm.reset();
        this.list.items = [];
    }

    changeToGetSubModel() {
        const id = this.searchForm.value.model_id;
        const arr = this.listMaster['models'];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]['model_id'] === id) {
                return this.listMaster['sub_models'] = arr[i]['sub_models'];
            }
        }
    }

    changeToGetSubCategory() {
        const id = this.filterForm.value.category_id_filter;
        const arr = this.listMaster['categories'];
        this.listMaster['sub_cat'] = [];
        for (let k = 0; k < id.length; k++) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i]['category_id'] === id[k]) {
                    this.listMaster['sub_cat'] = this.listMaster['sub_cat'].concat(arr[i]['sub_categories']);
                }
            }
        }
    }

    getList() {
        const params = Object.assign({}, this.tableService.getParams(), this.searchForm.value, this.filterForm.value);
        Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

        this.productService.getListItem(params).subscribe(res => {
            try {
                if (!res.data.rows) {
                    this.list.items = [];
                    return;
                }
                this.list.items = res.data.rows;
                this.listMaster['brands'] = res.data.meta_filters.brands;
                this.listMaster['categories'] = res.data.meta_filters.categories;
                this.listMaster['certification'] = res.data.meta_filters.certification;
                this.listMaster['countries'] = res.data.meta_filters.countries;
                this.listMaster['partlinks_no'] = res.data.meta_filters.partlinks_no;
                this.listMaster['part_no'] = res.data.meta_filters.part_no;
                this.listMaster['manufacturers'] = res.data.meta_filters.manufacturers;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

    createOrder() {
        if (this.list.checklist.length === 0) { return; }
        const ids: any = (this.list.checklist.map(_ => { _.order_quantity = 1; _.source = 'Manual'; return _; }) || []);
        console.log(ids);
        this.router.navigateByData({ url: ['order-management/sale-order/create'], data: ids });
        //  this.router.navigate(['order-management/sale-order/create', { data : ids }])
    }
}
