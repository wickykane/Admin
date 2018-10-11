import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../services/table.service';

import { ItemService } from './item.service';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { cdArrowTable } from '../index';
import { Helper } from './../helper/common.helper';

declare var jQuery: any;

@Component({
    selector: 'app-quote-modal-content',
    templateUrl: './quote.modal.html',
    providers: [HotkeysService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
// tslint:disable-next-line:component-class-suffix
export class QuoteModalContent implements OnInit, OnDestroy {
    @Input() company_id;
    @ViewChild(cdArrowTable) table: cdArrowTable;

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
        private cd: ChangeDetectorRef,
        public fb: FormBuilder,
        private helper: Helper,
        public _hotkeysService: HotkeysService,
        public toastr: ToastrService,
        public tableService: TableService) {
        this.searchForm = fb.group({
            'quote_no': [null],
            'part_no': [null],
            'quote_date': [null],
        });

        //  Assign get list function name, override variable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;

    }

    ngOnInit() {
        this.getList();
        this.initKeyBoard();
    }

    refresh() {
        this.cd.detectChanges();
    }

    // Table event
    selectData(index, flag?) {
        if (!flag) {
            this.list.items[index].is_checked = !this.list.items[index].is_checked;
        }
        this.list.items.forEach((item, i) => {
            if (i !== index) {
                item.is_checked = false;
            }
        });
        this.refresh();
        this.isAllChecked();
    }

    checkAll(ev) {
        // this.list.items.forEach(x => x.is_checked = ev.target.checked);
        // this.list.checklist = this.list.items.filter(_ => _.is_checked);
    }

    isAllChecked() {
        this.checkAllItem = this.list.items.every(_ => _.is_checked);
        this.list.checklist = this.list.items.filter(_ => _.is_checked);
    }

    /**
     * Internal Function
     */

    ok() {
        const checkedItem = this.list.items.filter(item => item.is_checked)[0] || {};
        this.activeModal.close(checkedItem.id);
    }
    getList() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

        this.itemService.getListActiveSaleQuote(this.company_id, params).subscribe(res => {
            try {
                if (!res.data.rows) {
                    this.list.items = [];
                    this.refresh();
                    return;
                }
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    selectTable() {
        this.selectedIndex = 0;
        jQuery('.modal').focus();
        this.table.scrollToTable('.modal-open .modal');
    }
    // Keyboard

    initKeyBoard() {
        this.data['key_config'] = {
            quote_no: {
                element: null,
                focus: true,
            },
        };

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            if (this.data['key_config'].quote_no.element) {
                this.data['key_config'].quote_no.element.nativeElement.focus();
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
            this.tableService.resetAction();
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
            this.ok();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'View'));

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
