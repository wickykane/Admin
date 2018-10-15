import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../../../services/table.service';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { cdArrowTable } from '../../../../../shared/index';

import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Helper } from '../../../../../shared/helper/common.helper';
import { DebitMemoService } from '../../debit-memo.service';

declare var jQuery: any;

@Component({
    selector: 'app-misc-items-modal-content',
    templateUrl: './misc-items.modal.html',
    styleUrls: ['./misc-items.modal.scss'],
    providers: [DebitMemoService, TableService]
})
// tslint:disable-next-line:component-class-suffix
export class MiscItemsDebitModalContent implements OnInit, OnDestroy {

    @ViewChild(cdArrowTable) table: cdArrowTable;
    public data = {};
    public selectedIndex = 0;

    public listIgnoredItems = [];
    public orderId = '';
    @Input() set setIgnoredItems(data) {
        if (data && data['orderId'] !== null && data['orderId'] !== undefined) {
            this.orderId = data['orderId'];
        }
        if (data && data['items'] && data['items'].length) {
            this.listIgnoredItems = data['items'];
        }
        this.getListItems();
    }
    public listItems = [];
    public listItemSelected = [];
    public isCheckedAll = false;
    public searchForm: FormGroup;

    constructor(
        public tableService: TableService,
        public activeModal: NgbActiveModal,
        public fb: FormBuilder,
        private helper: Helper,
        public _hotkeysService: HotkeysService,
        private toastr: ToastrService,
        private debitService: DebitMemoService) {
        this.searchForm = fb.group({
            no: [null],
            des: [null]
        });

        this.tableService.getListFnName = 'getListItems';
        this.tableService.context = this;
    }

    ngOnInit() {
        this.initKeyBoard();
    }

    getListItems() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value};
        // params['misc_ids_ignore'] = this.listIgnoredItems.join();
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);
        this.debitService.getListItemsFromMisc(this.orderId, params).subscribe(
            res => {
                try {
                    this.listItems = res.data.rows;
                    this.tableService.matchPagingOption(res.data);
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    checkAll(ev) {
        this.listItems.forEach(x => (x.is_checked = ev.target.checked));
        this.listItemSelected = this.listItems.filter(_ => _.is_checked);
    }

    isAllChecked() {
        this.isCheckedAll = this.listItems.every(_ => _.is_checked);
        this.listItemSelected = this.listItems.filter(_ => _.is_checked);
    }

    selectTable() {
        this.selectedIndex = 0;
        jQuery('.modal').focus();
        this.table.scrollToTable('.modal-open .modal');
    }

    onAddItem() {
        this.listIgnoredItems.forEach(ignoreItem => {
            const itemIndex = this.listItemSelected.findIndex(item => item.id === ignoreItem);
            if (itemIndex >= 0) {
                this.listItemSelected.splice(itemIndex, 1);
            }
        });
        this.listItemSelected.forEach(item => {
            item['is_item'] = 0;
            item['misc_id'] = item['id'];
            item['misc_id'] = item['id'];
            item['qty'] = item['qty'] || 0;
            item['price'] = item['price'] || 0;
            item['discount_percent'] = item['discount_percent'] || 0;
            item['tax_percent'] = item['tax_percent'] || 0;
            item['tax'] = item['tax'] || 0;
            item['discount'] = item['discount'] || 0;
            item['base_price'] = (item['qty'] * item['price']) || 0;
            item['total_price'] = (item['base_price'] - item['discount']) || 0;
        });
        this.activeModal.close(this.listItemSelected);
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

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+q', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            this.getListItems();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+w', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            this.searchForm.reset();
            this.getListItems();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
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

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+pageup', (event: KeyboardEvent): boolean => {
            this.tableService.pagination.page--;
            if (this.tableService.pagination.page < 1) {
                this.tableService.pagination.page = 1;
                return;
            }
            this.tableService.changePage(this.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Next page'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+pagedown', (event: KeyboardEvent): boolean => {
            this.tableService.pagination.page++;
            if (this.tableService.pagination.page > this.tableService.pagination.total_page) {
                this.tableService.pagination.page = this.tableService.pagination.total_page;
                return;
            }
            this.tableService.changePage(this.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Previous page'));
    }

    resetKeys() {
        const keys = Array.from(this._hotkeysService.hotkeys);
        keys.map(key => {
            this._hotkeysService.remove(key);
        });
    }

    ngOnDestroy(): void {
        this.resetKeys();
    }
}
