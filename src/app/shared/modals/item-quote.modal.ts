import { ChangeDetectionStrategy, Component, Input, OnInit, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../services/table.service';

import { ItemService } from './item.service';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-item-quote-modal-content',
    templateUrl: './item-quote.modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
// tslint:disable-next-line:component-class-suffix
export class ItemQuoteModalContent implements OnInit {
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

    constructor(public activeModal: NgbActiveModal,
        private cd: ChangeDetectorRef,
        public itemService: ItemService,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService) {
        this.searchForm = fb.group({
            'cd': [null],
            'sku': [null]
        });
        //  Assign get list function name, override variable here
        console.log(this.company_id);
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;

    }

    ngOnInit() {
        this.getList();
    }

    refresh() {
        this.cd.detectChanges();
    }
    // Table event
    selectData(index) {
        console.log(index);
    }

    checkAll(ev) {
        this.list.items.forEach(x => x.is_checked = ev.target.checked);
        this.list.checklist = this.list.items.filter(_ => _.is_checked);
        this.refresh();
    }

    isAllChecked() {
        this.checkAllItem = this.list.items.every(_ => _.is_checked);
        this.list.checklist = this.list.items.filter(_ => _.is_checked);
        this.refresh();
    }

    /**
     * Internal Function
     */
    resetTab() {
        this.searchForm.reset();
        this.list.items = [];
        this.refresh();
    }

    getList() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };
        console.log(params);
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

        this.itemService.getListAllItemFromQuote(this.company_id, params).subscribe(res => {
            try {
                if (!res.data.rows) {
                    this.list.items = [];
                    this.refresh();
                    return;
                }
                this.list.items = res.data.rows;
                this.listMaster['warehouses'] = res.data.warehouses;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }
}
