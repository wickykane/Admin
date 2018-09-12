import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../services/table.service';

import { ItemService } from './item.service';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-item-modal-content',
    templateUrl: './item.modal.html',
    providers: [TableService],
})
// tslint:disable-next-line:component-class-suffix
export class ItemModalContent implements OnInit {
    @Input() id;
    @Input() flagBundle;

    /**
     * Variable Declaration
     */
    public listMaster = {};
    public selectedIndex = 0;

    public list = {
        items: [],
        checklist: []
    };
    public checkAllItem;
    public data = {};


    public searchForm: FormGroup;
    public filterForm: FormGroup;

    constructor(public activeModal: NgbActiveModal,
        public itemService: ItemService,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService) {


        this.searchForm = fb.group({
            'cd': [null],
            'name': [null],
            'sts': [null],
            'vin': [null],
            'year_from': [null],
            'year_to': [null],
            'manufacturer_id': [null],
            'model_id': [null],
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
            'part_no_filter': [null]
        });

        //  Assign get list function name, override variable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;

    }

    ngOnInit() {
        //  Init Fn
        this.getListReference();
    }

    getListReference() {
        this.itemService.getReferenceList().subscribe(res => {
            try {
                this.listMaster['models'] = res.data.models;
                this.listMaster['years'] = res.data.years.map((e) => ({ id: e, name: e }));
                this.listMaster['make'] = res.data.manufacturers;
                this.listMaster['certification_partNumber'] = res.data.certification;
            } catch (e) {
                console.log(e.message);
            }
        });
    }

    // Table event
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
    resetTab() {
        this.searchForm.reset();
        this.filterForm.reset();
        this.list.items = [];
    }

    changeToGetSubModel() {
        const id = this.searchForm.value.model_id;
        const arr = this.listMaster['models'];
        for ( const item of arr) {
           if (item['model_id'] === id) {
               return this.listMaster['sub_models'] = arr['sub_models'];
           }
        }
    }

    changeToGetSubCategory() {
        const id = this.filterForm.value.category_id_filter;
        const arr = this.listMaster['categories'];
        this.listMaster['sub_cat'] = [];
        for (const item of id ) {
            for (const temp of arr) {
               if (temp['category_id'] === item) {
                this.listMaster['sub_cat'] = this.listMaster['sub_cat'].concat(temp['sub_categories']);
               }
            }
        }
    }
    // getNameWarehouse(arr, id) {
    //     if (arr) {
    //         return 'WH' + arr.find(item => item.warehouse_id === id)['name'];
    //     }
    // }

    getList() {
        const params = {...this.tableService.getParams(), ...this.searchForm.value, ...this.filterForm.value};
        Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

        this.itemService.getMasterItems(params).subscribe(res => {
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
                this.listMaster['warehouses'] = res.data.warehouses;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }
}
