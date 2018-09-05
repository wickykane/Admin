import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../../../services/table.service';

import { ItemService } from './../../../../../shared/modals/item.service';

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
    @Input() clone_items;
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
        public itemService: ItemService,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService) {

        this.searchForm = fb.group({
            'no': [null],
            'des': [null],
            'type': [null],
            'tax': 1,
            'sts': 1
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
        console.log(this.clone_items);
        console.log(this.items_removed);
        // this.items_removed.
        // this.clone_items.forEach(item => {
        //     if (item.item_type === 1) {
        //         this.items_removed.
        //     }
        // });
        // const tempArr = _losdah.intersectionBy(this.clone_items, this.items_removed, 'item_id');
        // console.log(tempArr);
        this.clone_items.forEach( item => {
            if (item.is_item === 1 && _losdah.find(this.items_removed, {item_id: item.item_id})) {
                this.list.items.push(item);
            }
        });
        // this.list.items = tempArr;
    }
}
