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
    selector: 'app-item-modal-content',
    templateUrl: './item.modal.html',
    providers: [TableService, HotkeysService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
// tslint:disable-next-line:component-class-suffix
export class ItemModalContent implements OnInit, OnDestroy {
    @Input() id;
    @Input() flagBundle;
    @ViewChild('tabSet') tabSet;
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

    public arrIdChecked = [];

    public searchForm: FormGroup;
    public filterForm: FormGroup;

    constructor(public activeModal: NgbActiveModal,
        private helper: Helper,
        private cd: ChangeDetectorRef,
        public _hotkeysService: HotkeysService,
        public itemService: ItemService,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService) {


        this.searchForm = fb.group({
            'cd': [null],
            'name': [null],
            'sts': [null],
            'vin': [null],
            'year_from': [null],
            'year_to': [null],
            'manufacturer_id': [null],
            'model_id': [null],
            'oem': [null],
            'partlinks_no': [null],
            'part_no': [null],
            'certification': [null],
        });

        this.filterForm = fb.group({
            'brand_id_filter': [null],
            'category_id_filter': [null],
            'sub_category_id': [null],
            'certification_filter': [null],
            'oem_filter': [null],
            'partlinks_no_filter': [null],
            'part_no_filter': [null]
        });

        //  Assign get list function name, override variable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;

    }

    ngOnInit() {
        //  Init Fn
        this.getListReference();
        this.initKeyBoard();
    }

    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    getListReference() {
        this.itemService.getReferenceList().subscribe(res => {
            try {
                this.listMaster['models'] = res.data.models;
                this.listMaster['years'] = res.data.years.map((e) => ({ id: e, name: e }));
                this.listMaster['make'] = res.data.manufacturers;
                this.listMaster['certification_partNumber'] = res.data.certification;
                this.refresh();
            } catch (e) {
                console.log(e.message);
            }
        });
    }

    // Table event
    selectData(index) {
        this.list.items[index].is_checked = !this.list.items[index].is_checked;
        this.isAllChecked(this.list.items[index]);
        this.refresh();
    }

    checkAll(ev) {
        this.list.items.forEach(x => x.is_checked = ev.target.checked);
        this.list.checklist = this.list.items.filter(_ => _.is_checked);
        this.refresh();
    }

    isAllChecked(item) {
        this.checkAllItem = this.list.items.every(_ => _.is_checked);
        // this.list.checklist = this.list.items.filter(_ => _.is_checked);
        if (item.is_checked) {
            this.arrIdChecked.push(item.item_id + item.item_condition_id);
            this.list.checklist.push(item);
        } else {
            const index = this.arrIdChecked.indexOf(item.item_id + item.item_condition_id);
            this.arrIdChecked.splice(index, 1);
            this.list.checklist.splice(index, 1);
        }
    }

    /**
     * Internal Function
     */
    resetTab() {
        this.searchForm.reset();
        this.filterForm.reset();
        this.list.items = [];
        setTimeout(() => {
            this.refresh();
        });
    }

    changeToGetSubModel() {
        const id = this.searchForm.value.model_id;
        const arr = this.listMaster['models'];
        for (const item of arr) {
            if (item['model_id'] === id) {
                return this.listMaster['sub_models'] = arr['sub_models'];
            }
        }
    }

    changeToGetSubCategory() {
        const id = this.filterForm.value.category_id_filter;
        const arr = this.listMaster['categories'];
        this.listMaster['sub_cat'] = [];
        for (const item of id) {
            for (const temp of arr) {
                if (temp['category_id'] === item) {
                    this.listMaster['sub_cat'] = this.listMaster['sub_cat'].concat(temp['sub_categories']);
                }
            }
        }
    }
    // getNameWarehouse(arr, id) {
    //     if (arr) {
    //         return 'WH' + arr.find(item => item.warehouse_id === id)['name'];
    //     }
    // }

    getList() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value, ...this.filterForm.value };
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

        this.itemService.getMasterItems(params).subscribe(res => {
            try {
                if (!res.data.rows) {
                    this.list.items = [];
                    this.refresh();
                    return;
                }
                this.list.items = res.data.rows;
                this.listMaster['brands'] = res.data.meta_filters.brands;
                this.listMaster['categories'] = res.data.meta_filters.categories;
                this.listMaster['certification'] = res.data.meta_filters.certification;
                this.listMaster['countries'] = res.data.meta_filters.countries;
                this.listMaster['warehouses'] = res.data.warehouses;
                this.tableService.matchPagingOption(res.data);

                this.arrIdChecked.forEach(x => {
                    this.list.items.forEach(y => {
                        if (x === (y.item_id + y.item_condition_id)) {
                            y.is_checked = true;
                        }
                    });
                });

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
            year_from: {
                element: null,
                focus: true,
            },
            oem: {
                elment: null,
                focus: true,
            },
            vin: {
                elment: null,
                focus: true,
            },
            brand_id_filter: {
                element: null,
                ng_select: true,
            }
        };

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            const defaultConfig = {
                vin: 'vin',
                vehicle: 'year_from',
                part_number: 'oem'
            };

            const activeTab = defaultConfig[this.tabSet.activeId];

            if (this.data['key_config'][activeTab].element) {
                this.data['key_config'][activeTab].element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus Search'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+v', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            (document.activeElement as HTMLInputElement).blur();
            this.tabSet.select('vin');
            this.refresh();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Vin'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            (document.activeElement as HTMLInputElement).blur();

            this.tabSet.select('vehicle');
            this.refresh();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Vehicle'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+p', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            (document.activeElement as HTMLInputElement).blur();
            this.tabSet.select('part_number');
            this.refresh();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Part Number'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            (document.activeElement as HTMLInputElement).blur();
            if (this.data['key_config'].brand_id_filter) {
                this.data['key_config'].brand_id_filter.element.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus Filter'));

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

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+2', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            this.tableService.resetAction(this.filterForm);
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset Filter'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            this.selectTable();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+o', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            this.activeModal.close(this.list.checklist);
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
