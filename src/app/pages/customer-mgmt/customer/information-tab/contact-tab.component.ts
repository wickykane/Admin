import { Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { TableService } from '../../../../services/table.service';
import { cdArrowTable } from '../../../../shared';
import { Helper } from '../../../../shared/helper/common.helper';
import { CustomerService } from '../../customer.service';


@Component({
    selector: 'app-customer-contact-tab',
    templateUrl: './contact-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
    providers: [HotkeysService]
})
export class CustomerContactTabComponent implements OnInit, OnDestroy {

    /**
     * letiable Declaration
     */
    @Input() set listData(data) {
        this.list.items = data || [];
    }

    public list = {
        items: []
    };

    searchForm: FormGroup;
    public data = {};
    public selectedIndex = 0;
    @ViewChild(cdArrowTable) table: cdArrowTable;
    constructor(private customerService: CustomerService,
        public _hotkeysServiceContact: HotkeysService,
        public tableService: TableService,
        private helper: Helper,
        ) {
        this.initKeyBoard();
    }

    ngOnInit() {}


    /**
     * Internal Function
     */
    selectData(index) {
        console.log(index);
    }
    hideCharacter(text) {
        if (!text) {
            return text;
        }
        return text.replace(/./g, 'x');
    }
    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td').focus();
    }
    initKeyBoard() {
        // this.data['key_config'] = {
        //     inv_num: {
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
        this._hotkeysServiceContact.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));
        // this._hotkeysServiceContact.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+left', (event: KeyboardEvent): boolean => {
        //     this.tableService.pagination.page--;
        //     if (this.tableService.pagination.page < 1) {
        //         this.tableService.pagination.page = 1;
        //         return;
        //     }
        //     this.tableService.changePage(this.tableService.pagination.page);
        //     return;
        // }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Previous page'));

        // this._hotkeysServiceContact.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+right', (event: KeyboardEvent): boolean => {
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
        const keys = Array.from(this._hotkeysServiceContact.hotkeys);
        keys.map(key => {
            this._hotkeysServiceContact.remove(key);
        });
    }

    ngOnDestroy() {
       this.resetKeys();
    }
}
