import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { cdArrowTable } from '../../../../../shared/index';

import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Helper } from '../../../../../shared/helper/common.helper';
import { DebitMemoService } from '../../debit-memo.service';

declare var jQuery: any;

@Component({
    selector: 'app-items-order-modal-content',
    templateUrl: './items-order.modal.html',
    styleUrls: ['./items-order.modal.scss'],
    providers: [DebitMemoService, HotkeysService]
})
// tslint:disable-next-line:component-class-suffix
export class ItemsOrderDebitModalContent implements OnInit, OnDestroy {

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
            this.getListItems();
        }
    }
    public listItems = [];
    public listItemSelected = [];
    public isCheckedAll = false;
    public searchForm: FormGroup;

    constructor(
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
    }

    ngOnInit() {
        this.initKeyBoard();
    }

    onSearchList() {
        return this.listIgnoredItems.length && this.getListItems();
    }

    getListItems() {
        const params = { ...this.searchForm.value};
        params['item_ids'] = this.listIgnoredItems.join();
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);
        this.debitService.getListItemsFromOrder(this.orderId, params).subscribe(
            res => {
                try {
                    this.listItems = res.data.items;
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
        this.listItemSelected.forEach(item => {
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

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+s', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            this.onSearchList();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            this.searchForm.reset();
            this.onSearchList();
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
