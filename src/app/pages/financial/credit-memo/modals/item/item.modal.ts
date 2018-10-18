import { Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../../../services/table.service';

import { CreditMemoService } from '../../credit-memo.service';

import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Helper } from '../../../../../shared/helper/common.helper';
import { cdArrowTable } from '../../../../../shared/index';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _losdah from 'lodash';
import { ToastrService } from 'ngx-toastr';

declare var jQuery: any;
@Component({
    selector: 'app-item-modal-credit-content',
    templateUrl: './item.modal.html',
    providers: [TableService],
})
// tslint:disable-next-line:component-class-suffix
export class CreditItemModalContent implements OnInit, OnDestroy {

    @ViewChild(cdArrowTable) table: cdArrowTable;
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
        private helper: Helper,
        public _hotkeysService: HotkeysService,
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
        this.initKeyBoard();
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

    selectTable() {
        this.selectedIndex = 0;
        jQuery('.modal').focus();
        this.table.scrollToTable('.modal-open .modal');
    }

    onAddItem() {
        this.activeModal.close(this.list.checklist);
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

    // Keyboard

    initKeyBoard() {
        this.data['key_config'] = {
            no: {
                element: null,
                focus: true,
            },
        };

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            if (this.data['key_config'].no.element) {
                this.data['key_config'].no.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus Search'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+s', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            this.tableService.searchAction();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            this.searchForm.reset();
            this.tableService.resetAction(this.searchForm);
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            this.selectTable();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+o', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            this.onAddItem();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'OK'));
    }

    resetKeys() {
        const keys = Array.from(this._hotkeysService.hotkeys);
        keys.map(key => {
            this._hotkeysService.remove(key);
        });
    }

    ngOnDestroy() {
        this.resetKeys();
    }
}
