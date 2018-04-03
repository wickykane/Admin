import { TableService } from './../../services/table.service';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ItemService } from './item.service';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'item-modal-content',
    templateUrl: './item.modal.html'
})
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
    }
    public checkAllItem;
    public data = {};


    public searchForm: FormGroup;
    public filterForm: FormGroup;

    constructor(public activeModal: NgbActiveModal,
        public itemService: ItemService,
        public fb: FormBuilder,
        public toastr: ToastsManager,
        private vRef: ViewContainerRef,
        public tableService: TableService) {
        this.toastr.setRootViewContainerRef(vRef);

        this.searchForm = fb.group({
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
            'country_id_filter': [null]
        });

        //Assign get list function name, override variable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;

    }

    ngOnInit() {
        //Init Fn
        this.listMaster['certification_partNumber'] = [{ code: "Y", value: "Yes" }, { code: "N", value: "No" }];
        this.getListReference();
    }

    getListReference() {
        this.itemService.getReferenceList().subscribe(res => {
            try {
                this.listMaster['models'] = res.data.models;
                this.listMaster['years'] = res.data.years.map(function (e) { return { id: e, name: e } });
                this.listMaster['manufacturers'] = res.data.manufacturers;
            } catch (e) {
                console.log(e.message)
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
    resetTab() {
        this.searchForm.reset();
        this.filterForm.reset();
        this.list.items = [];
    }

    changeToGetSubModel() {
        let id = this.searchForm.value.model_id;
        let arr = this.listMaster['models'];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i]['model_id'] == id) {
                return this.listMaster['sub_models'] = arr[i]['sub_models'];
            }
        }
    }

    changeToGetSubCategory() {
        let id = this.filterForm.value.category_id_filter;
        let arr = this.listMaster['categories'];
        this.listMaster['sub_cat'] = [];
        for (var k = 0; k < id.length; k++) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i]['category_id'] == id[k]) {
                    this.listMaster['sub_cat'] = this.listMaster['sub_cat'].concat(arr[i]['sub_categories']);
                }
            }
        }
    }

    getList() {
        var params = Object.assign({}, this.tableService.getParams(), this.searchForm.value, this.filterForm.value);
        Object.keys(params).forEach((key) => (params[key] == null || params[key] == '') && delete params[key]);

        this.itemService.getListAllItem(params).subscribe(res => {
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
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }
}