import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { cdArrowTable } from '../../../../shared/index';
import { Helper } from './../../../../shared/helper/common.helper';

import { RMAService } from '../rma.service';

declare var jQuery: any;

@Component({
    selector: 'app-items-order-modal-content',
    templateUrl: './items-order.modal.html',
    styleUrls: ['./items-order.modal.scss'],
    providers: [RMAService, HotkeysService]
})
// tslint:disable-next-line:component-class-suffix
export class ItemsOrderModalContent implements OnInit, OnDestroy {

    public listIgnoredItems = [];
    selectedIndex = 0;
    public orderId = '';
    @Input() set setIgnoredItems(data) {
        if (data && data['items'] && data['items'].length) {
            this.listIgnoredItems = data['items'];
            this.getListItems();
        }
    }
    public listItems = [];
    public listItemSelected = [];
    public isCheckedAll = false;
    public searchForm: FormGroup;

    public filter = {
        sku: '',
        des: ''
    };
    public data = {};

    @ViewChild(cdArrowTable) table: cdArrowTable;

    constructor(
        public activeModal: NgbActiveModal,
        public fb: FormBuilder,
        private toastr: ToastrService,
        private service: RMAService,
        public _hotkeysService: HotkeysService,
        public helper: Helper) {
        this.searchForm = fb.group({
            sku: [null],
            des: [null]
        });
    }

    ngOnInit() {
        this.initKeyBoard();
    }

    initKeyBoard() {

      this.data['key_config'] = {
          sku: {
              element: null,
              focus: true,
          }
      };

      this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
          event.preventDefault();
          if (this.data['key_config'].sku.element) {
              this.data['key_config'].sku.element.nativeElement.focus();
          }
          const e: ExtendedKeyboardEvent = event;
          e.returnValue = false; // Prevent bubbling
          return e;
      }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus Search'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            this.selectTable();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+s', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            this.searchList();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            this.resetList();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));


        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+a', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            this.onAddItem();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Add'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+c', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            this.activeModal.close();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Close'));

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


    selectData(index) {
        this.listItems[index].is_checked = !this.listItems[index].is_checked;
        this.isAllChecked();
    }

    selectTable() {
        this.selectedIndex = 0;
        jQuery('.modal').focus();
        this.table.scrollToTable('.modal-open .modal');
    }

    onSearchList() {
        return this.listIgnoredItems.length && this.getListItems();
    }

    getListItems() {
        this.listItems = this.listIgnoredItems;
        this.listItems.map(item => item.is_checked = false);
    }

    checkAll(ev) {
        this.listItems.forEach(x => (x.is_checked = ev.target.checked));
        this.listItemSelected = this.listItems.filter(_ => _.is_checked);
    }

    isAllChecked() {
        this.isCheckedAll = this.listItems.every(_ => _.is_checked);
        this.listItemSelected = this.listItems.filter(_ => _.is_checked);
    }

    onAddItem() {
        this.activeModal.close(this.listItemSelected);
    }

    searchList() {
      this.filter = {
        sku: this.searchForm.value.sku,
        des: this.searchForm.value.des,
      };
    }

    resetList() {
      this.searchForm.reset();
      this.filter = {
        sku: '',
        des: ''
      };
    }
}
