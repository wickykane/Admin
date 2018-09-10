import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../../../services/table.service';

import { CreditMemoService } from '../../credit-memo.service';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _losdah from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-item-modal-credit-content',
    templateUrl: './item.modal.html',
    providers: [TableService],
})
// tslint:disable-next-line:component-class-suffix
export class CreditItemModalContent implements OnInit {
    @Input() id;
    @Input() flagBundle;
    @Input() items_removed;

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
        public creditMemoService: CreditMemoService,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService) {

        this.searchForm = fb.group({
            'no': [null],
            'des': [null]
        });
        //  Assign get list function name, override variable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;

    }

    ngOnInit() {
        this.getList();
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
        this.list.items = [];
    }
    getList() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value, ...this.items_removed };
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);
        console.log(params);

        this.creditMemoService.getListItemRemoved(params).subscribe(res => {
            try {
                if (!res.data.inv_detail) {
                    this.list.items = [];
                    return;
                }
                this.list.items = res.data.inv_detail;
                // this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }
}
