import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTab } from '@ng-bootstrap/ng-bootstrap';
import * as  _ from 'lodash';
import { ProductService } from '../product-mgmt.service';
import { TableService } from './../../../services/table.service';
import { PartKeyService } from './keys.control';

@Component({
    selector: 'app-part-list',
    templateUrl: './part-list.component.html',
    styleUrls: ['./part-list.component.scss'],
    providers: [PartKeyService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartListComponent implements OnInit {
    /**
     * Variable Declaration
     */
    public searchForm: FormGroup;
    public filterForm: FormGroup;

    public listMaster = {};
    public selectedIndex = -1;
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
        public itemKeyService: PartKeyService,
        private productService: ProductService,
        private cd: ChangeDetectorRef
    ) {
        this.searchForm = fb.group({
            cd: [null],
            name: [null],
            sts: [null],
            vin: [null],
            year_from: [null],
            year_to: [null],
            make_id: [null],
            model_id: [null],
            oem: [null],
            partlinks_no: [null],
            part_no: [null],
            certification: [null]
        });

        this.filterForm = fb.group({
            category_id_filter: [null],
            sub_category_id: [null],
            brand_id_filter: [null],
            certification_filter: [null],
            partlinks_no_filter: [null],
            part_no_filter: [null]
        });

        //  Assign get list function name, override variable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        //  Init Key
        this.itemKeyService.watchContext.next(this);
    }

    ngOnInit() {
        this.getListReference();
    }
    /**
     * Master Data
     */

     refresh() {
         this.cd.detectChanges();
     }

    getListReference() {
        this.productService.getReferList().subscribe(res => {
            try {
                this.listMaster['models'] = res.data.models;
                this.listMaster['categories'] = _.orderBy(res.data.categories, ['name'], ['asc']);
                this.listMaster['countries'] = res.data.countries;
                this.listMaster['brands'] = _.orderBy(res.data.brands, ['name'], ['asc']);
                this.listMaster['years'] = res.data.years.map(e => ({
                    id: e,
                    name: e
                }));
                this.listMaster['makes'] = res.data.makes;
                this.listMaster['certification'] = res.data.certification;
                this.refresh();
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
        this.list.items.forEach(x => (x.is_checked = ev.target.checked));
        this.list.checklist = this.list.items.filter(temp => temp.is_checked);
    }

    isAllChecked() {
        this.checkAllItem = this.list.items.every(temp => temp.is_checked);
        this.list.checklist = this.list.items.filter(temp => temp.is_checked);
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
        const params = { ...this.tableService.getParams(), ...this.searchForm.value, ...this.filterForm.value };
        console.log(params);
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
        Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

        Object.keys(params).forEach((key) => {
            if ((params[key] !== null || params[key] !== '')) {
                if ((typeof params[key]) === 'object') {

                    if (params[key][0] === null || params[key][0] === '' ) {
                        delete params[key];
                    }

                }
            }
        });
        this.productService.getPartList(params).subscribe(res => {
            try {
                if (!res.data.rows) {
                    this.list.items = [];
                    return;
                }
                this.list.items = res.data.rows;
                this.listMaster['brands'] = _.orderBy(res.data.meta_filters.brands, ['name'], ['asc']);
                this.listMaster['categories'] = _.orderBy(res.data.meta_filters.categories, ['name'], ['asc']);
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }
}
