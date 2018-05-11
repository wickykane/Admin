import { TableService } from './../../services/table.service';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ItemService } from './item.service';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-item-modal-content',
    templateUrl: './order-salequote.modal.html'
})
export class OrderSaleQuoteModalContent implements OnInit {
    @Input() company_id;

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

        // Assign get list function name, override variable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;

    }

    ngOnInit() {
        // Init Fn
       console.log(this.company_id);
       this.getList();
       this.getListItemReference(this.company_id);
       this.getListSalesQuoteReference(this.company_id);

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

    getList() {
        console.log(this.company_id);
        this.itemService.getListSalesQuoteItem(this.company_id).subscribe(res => {
            try {
                if (!res.data.rows) {
                    this.list.items = [];
                    return;
                }
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }
    getListItemReference(company_id) {
        this.itemService.getListItemReference(company_id).subscribe(res => {
            try {
                console.log(res);
            } catch (e) {
                console.log(e);
            }
        });
    }
    getListSalesQuoteReference(company_id) {
        this.itemService.getListSalesQuoteReference(company_id).subscribe(res => {
            try {
                console.log(res);
            } catch (e) {
                console.log(e);
            }
        });
    }

}
