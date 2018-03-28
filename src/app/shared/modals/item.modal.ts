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
    public selectedIndexItem = 0;
    public selectedIndexBundle = 0;
    public list = {
        items: [],
        selectedItems: [],
        bundles: [],
        selectedBundles: []
    };

    public tableBundleService: any;

    searchForm: FormGroup;
    searchBundleForm: FormGroup;

    constructor(public activeModal: NgbActiveModal,
        public itemService: ItemService,
        public fb: FormBuilder,
        public toastr: ToastsManager,
        private vRef: ViewContainerRef,
        public tableService: TableService) {
        this.toastr.setRootViewContainerRef(vRef);

        this.searchForm = fb.group({
            'sku': [null],
            'name': [null],
            'category_id': [null]
        });

        this.searchBundleForm = fb.group({
            'cd': [null],
            'name': [null]
        });

        //Assign get list function name, override variable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;

        this.tableBundleService = new TableService();
        this.tableBundleService.getListFnName = 'getListBundle';
        this.tableBundleService.context = this;

    }

    ngOnInit() {
        //Init Fn
        if (this.flagBundle) {
            this.getListBundle();
        }
        this.getList();
        this.getReferenceList();
        this.list.selectedItems = [];
        this.list.selectedBundles = [];
    }

    getList() {
        if (this.id) {
            var params = Object.assign({}, this.tableService.getParams(), this.searchForm.value);
            Object.keys(params).forEach((key) => (JSON.parse(params[key]) == null || JSON.parse(params[key]) == '') && delete params[key]);

            this.itemService.getListItemBaseSupplier(params, this.id).subscribe(res => {
                try {
                    this.list.items = res.results.rows;
                    this.tableService.matchPagingOption(res.results);
                } catch (e) {
                    console.log(e);
                }
            });
        }else{
            var params = Object.assign({}, this.tableService.getParams(), this.searchForm.value);
            Object.keys(params).forEach((key) => (JSON.parse(params[key]) == null || JSON.parse(params[key]) == '') && delete params[key]);

            this.itemService.getListAllItem(params).subscribe(res => {
                try {
                    this.list.items = res.results.rows;
                    this.tableService.matchPagingOption(res.results);
                } catch (e) {
                    console.log(e);
                }
            });
        }

    }

    getListBundle() {
        var params = Object.assign({}, this.tableBundleService.getParams(), this.searchBundleForm.value);
        Object.keys(params).forEach((key) => (JSON.parse(params[key]) == null || JSON.parse(params[key]) == '') && delete params[key]);

        this.itemService.getListBundleBase(params).subscribe(res => {
            try {
                this.list.bundles = res.results.rows;
                this.tableBundleService.matchPagingOption(res.results);
            } catch (e) {
                console.log(e);
            }
        });
    }

    getReferenceList() {
        this.itemService.getReferenceList().subscribe(res => {
            try {
                this.listMaster['categories'] = res.results.categories;
            } catch (e) {
                console.log(e);
            }
        })
    }

    updateData() {
        this.list.items.forEach(x => {
            if (x.state) {
                this.list.selectedItems.push(x);
                this.activeModal.close(this.list.selectedItems);
            }
        });
        if (this.flagBundle) {
            this.list.bundles.forEach(x => {
                if (x.state) {
                    this.list.selectedBundles.push(x);
                    this.activeModal.close(this.list.selectedBundles);
                }
            })
        }
    }


    checkAll(ev) {
        this.list.items.forEach(x => x.state = ev.target.checked);
    }

    isAllChecked() {
        return this.list.items.every(_ => _.state);
    }

    checkAllBundle(ev) {
        this.list.bundles.forEach(x => x.state = ev.target.checked);
    }

    isAllCheckedBundle() {
        return this.list.bundles.every(_ => _.state);
    }

}
