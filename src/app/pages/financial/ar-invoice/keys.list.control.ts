import { Injectable } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs/Rx';
import { Helper } from '../../../shared/index';

@Injectable()
export class InvoiceKeyService {
    public context: any;
    public _hotkeysService;
    public watchContext = new Subject<any>();

    constructor(public helper: Helper) {
        this.watchContext.subscribe(res => {
            this.context = res.context;
            this._hotkeysService = res.service;
            this.initKey();
        });
    }



    getKeys() {
        return Array.from(this._hotkeysService.hotkeys);
    }

    initKey() {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+n', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.createOrder();
            return;
        }, undefined, 'Create Order'));


        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+pagedown', (event: KeyboardEvent): boolean => {
            this.context.tableService.pagination.page++;
            if (this.context.tableService.pagination.page > this.context.tableService.pagination.total_page) {
                this.context.tableService.pagination.page = this.context.tableService.pagination.total_page;
                return;
            }
            this.context.tableService.changePage(this.context.tableService.pagination.page);
            return;
        }, undefined, 'Move to previous page'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+pageup', (event: KeyboardEvent): boolean => {
            this.context.tableService.pagination.page--;
            if (this.context.tableService.pagination.page < 1) {
                this.context.tableService.pagination.page = 1;
                return;
            }
            this.context.tableService.changePage(this.context.tableService.pagination.page);
            return;
        }, undefined, 'Move to next page'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+end', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.pagination.page = this.context.tableService.pagination.total_page;
            this.context.tableService.changePage(this.context.tableService.pagination.page);
            return;
        }, undefined, 'Move to last page'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+home', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.pagination.page = 1;
            this.context.tableService.changePage(this.context.tableService.pagination.page);
            return;
        }, undefined, 'Move to first page'));

        /**
         * SEARCH
         */
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+s', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.searchAction();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search data based on key'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.resetAction(this.context.searchForm);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset Search'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.moreFilter();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Filter'));

    }
}
