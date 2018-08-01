import { Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as  _ from 'lodash';
import { ProductService } from '../product-mgmt.service';
import { TableService } from './../../../services/table.service';
import { ItemKeyService } from './keys.control';

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
            'year_from': [null],
            'year_to': [null],
            'make_id': [null],
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
        console.log(this.filterForm);
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
                this.listMaster['years'] = res.data.years.map((e) => ({ id: e, name: e }));
                this.listMaster['make'] = res.data.makes;
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
        this.list.checklist = this.list.items.filter(item => item.is_checked);
    }

    isAllChecked() {
        this.checkAllItem = this.list.items.every(item => item.is_checked);
        this.list.checklist = this.list.items.filter(item => item.is_checked);
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
        for (const i of arr) {
            if (arr['model_id'] === id) {
                return this.listMaster['sub_models'] = arr['sub_models'];
            }
        }
    }

    changeToGetSubCategory() {
        const id = this.filterForm.value.category_id_filter;
        const arr = this.listMaster['categories'];
        this.listMaster['sub_cat'] = [];
        for (const k of id) {
            for (const i of arr) {
                if (arr['category_id'] === k) {
                    this.listMaster['sub_cat'] = this.listMaster['sub_cat'].concat(arr['sub_categories']);
                }
            }
        }
    }

    getList() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };
        // Change filter array
        try {
            Object.keys(this.filterForm.value).map(key => {
                if (this.filterForm.value[key]) {
                    const data = this.filterForm.value[key].toString().split(',').map(item => item.trim());
                    if (data) {
                        params[key + '[]'] = data;
                    }
                }
            });

        } catch (e) { }

        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

        Object.keys(params).forEach((key) => {
            if ((params[key] !== null || params[key] !== '')) {
                if ((typeof params[key]) === 'object') {

                    if (params[key][0] === null || params[key][0] === '' ) {
                        delete params[key];
                    }

                }
            }
        });



        this.productService.getListItem(params).subscribe(res => {
            try {
                if (!res.data.rows) {
                    this.list.items = [];
                    return;
                }
                this.list.items = res.data.rows;
                this.listMaster['brands'] = _.orderBy(res.data.meta_filters.brands, ['name'], ['asc']);
                this.listMaster['categories'] = _.orderBy(res.data.meta_filters.categories, ['name'], ['asc']);
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
        const ids: any = (this.list.checklist.map(item => { item.quantity = 1; item.source = 'From Master'; item.source_id = 1; return item; }) || []);
        console.log(ids);
        this.router.navigateByData({ url: ['order-management/sale-order/create'], data: ids });
        //  this.router.navigate(['order-management/sale-order/create', { data : ids }])
    }
}
