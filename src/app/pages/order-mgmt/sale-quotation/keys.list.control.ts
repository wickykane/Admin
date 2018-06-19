import { Subject } from 'rxjs/Rx';
import { Injectable, OnDestroy } from '@angular/core';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
@Injectable()
export class SaleQuoteKeyService implements OnDestroy {
    public context: any;
    public watchContext = new Subject<any>();

    constructor(private _hotkeysService: HotkeysService) {
        this.watchContext.subscribe(res => {
            this.context = res;
            this.initKey();
        });
    }

    ngOnDestroy() {
        this.resetKeys();
    }

    resetKeys() {
        const keys = this.getKeys();
        keys.map(key => {
            this._hotkeysService.remove(key);
        });
    }

    getKeys() {
        return Array.from(this._hotkeysService.hotkeys);
    }

    initKey() {
        this.resetKeys();
        this._hotkeysService.add(new Hotkey('alt+n', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.createOrder();
            return;
        }, undefined, 'Create Order'));

        // this._hotkeysService.add(new Hotkey('alt+a', (event: KeyboardEvent): boolean => {
        //     this.context.checkAllItem = !this.context.checkAllItem;
        //     this.context.checkAll({ target: { checked: this.context.checkAllItem } });
        //     return;
        // }, undefined, 'Select all items on page'));

        this._hotkeysService.add(new Hotkey('alt+pagedown', (event: KeyboardEvent): boolean => {
            this.context.tableService.pagination.page++;
            if (this.context.tableService.pagination.page > this.context.tableService.pagination.total_page) {
                this.context.tableService.pagination.page = this.context.tableService.pagination.total_page;
                return;
            }
            this.context.tableService.changePage(this.context.tableService.pagination.page);
            return;
        }, undefined, 'Move to previous page'));

        this._hotkeysService.add(new Hotkey('alt+pageup', (event: KeyboardEvent): boolean => {
            this.context.tableService.pagination.page--;
            if (this.context.tableService.pagination.page < 1) {
                this.context.tableService.pagination.page = 1;
                return;
            }
            this.context.tableService.changePage(this.context.tableService.pagination.page);
            return;
        }, undefined, 'Move to next page'));

        this._hotkeysService.add(new Hotkey('alt+end', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.pagination.page = this.context.tableService.pagination.total_page;
            this.context.tableService.changePage(this.context.tableService.pagination.page);
            return;
        }, undefined, 'Move to last page'));

        this._hotkeysService.add(new Hotkey('alt+home', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.pagination.page = 1;
            this.context.tableService.changePage(this.context.tableService.pagination.page);
            return;
        }, undefined, 'Move to first page'));

        /**
         * SEARCH
         */
        this._hotkeysService.add(new Hotkey('alt+s', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.searchAction();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search data based on key'));

        this._hotkeysService.add(new Hotkey('alt+r', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.resetAction(this.context.searchForm);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset Search'));
        // this._hotkeysService.add(new Hotkey('alt+shift+r', (event: KeyboardEvent): boolean => {
        //     event.preventDefault();
        //     this.context.tableService.resetAction(this.context.filterForm);
        //     return;
        // }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset Filter'));

        // this._hotkeysService.add(new Hotkey('ctrl+1', (event: KeyboardEvent): boolean => {
        //     event.preventDefault();
        //     this.context.selectTab('vin');
        //     return;
        // }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search by VIN'));
        //
        // this._hotkeysService.add(new Hotkey('ctrl+2', (event: KeyboardEvent): boolean => {
        //     event.preventDefault();
        //     this.context.selectTab('vehicle');
        //     return;
        // }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search by Vehicle'));
        //
        // this._hotkeysService.add(new Hotkey('ctrl+3', (event: KeyboardEvent): boolean => {
        //     event.preventDefault();
        //     this.context.selectTab('part_number');
        //     return;
        // }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search by Part Number'));
        this._hotkeysService.add(new Hotkey('alt+f', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.moreFilter();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Filter'));

    }
}
