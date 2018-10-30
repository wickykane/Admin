import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { cdArrowTable } from '../../../../shared';
import { Helper } from '../../../../shared/helper/common.helper';
import { CustomerService } from '../../customer.service';
import { CustomerKeyViewService } from '../keys.view.control';
import { TableService } from './../../../../services/table.service';

@Component({
    selector: 'app-customer-site-tab',
    templateUrl: './site-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
    providers: [HotkeysService, CustomerKeyViewService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerSiteTabComponent implements OnInit, OnDestroy {

    /**
     * letiable Declaration
     */
    @Input() set listData(data) {
        this.list.items = data || [];
    }

    public list = {
        items: []
    };
    public data = {};
    public selectedIndex = 0;
    @ViewChild(cdArrowTable) table: cdArrowTable;
    constructor(
        private customerService: CustomerService, private cd: ChangeDetectorRef,
        public tableService: TableService,
        public _hotkeysServiceSite: HotkeysService,
        private helper: Helper) {
            this.initKeyBoard();
    }

    ngOnInit() {}
    selectData(index) {
        console.log(index);
    }
    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }
    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td').focus();
    }
    initKeyBoard() {
        // this.data['key_config'] = {
        //     code: {
        //         element: null,
        //         focus: true,
        //     },
        // };
        // saveKeys() {
        //     this.keys = this.getKeys();
        //     this.context.data['tableKey'] = this.context.table.getKeys();
        //     this.resetKeys();
        //     this.context.table.resetKeys();
        // }
        this._hotkeysServiceSite.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));

        // this._hotkeysServiceSite.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
        //     event.preventDefault();
        //     if (this.data['key_config'].code.element) {
        //         this.data['key_config'].code.element.nativeElement.focus();
        //     }
        //     const e: ExtendedKeyboardEvent = event;
        //     e.returnValue = false; // Prevent bubbling
        //     return e;
        // }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus'));

        // this._hotkeysServiceSite.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent): boolean => {
        //     event.preventDefault();
        //     this.tableService.searchAction();
        //     return;
        // }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));

        // this._hotkeysServiceSite.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
        //     event.preventDefault();
        //     this.tableService.resetAction(this.searchForm);
        //     return;
        // }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));
        // this._hotkeysServiceSite.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+left', (event: KeyboardEvent): boolean => {
        //     this.tableService.pagination.page--;
        //     if (this.tableService.pagination.page < 1) {
        //         this.tableService.pagination.page = 1;
        //         return;
        //     }
        //     this.tableService.changePage(this.tableService.pagination.page);
        //     return;
        // }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Previous page'));

        // this._hotkeysServiceSite.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+right', (event: KeyboardEvent): boolean => {
        //     this.tableService.pagination.page++;
        //     if (this.tableService.pagination.page > this.tableService.pagination.total_page) {
        //         this.tableService.pagination.page = this.tableService.pagination.total_page;
        //         return;
        //     }
        //     this.tableService.changePage(this.tableService.pagination.page);
        //     return;
        // }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Next page'));
    }
    resetKeys() {
        const keys = Array.from(this._hotkeysServiceSite.hotkeys);
        keys.map(key => {
            this._hotkeysServiceSite.remove(key);
        });
    }

    ngOnDestroy() {
       this.resetKeys();
    }

}
