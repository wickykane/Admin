import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Helper } from '../../../shared/index';

@Injectable()
export class SaleQuoteKeyService {
    public context: any;
    public _hotkeysService;
    public watchContext = new Subject<any>();

    private keyConfig = {
        quote_no: {
            element: null,
            focus: true,
        },
        date_from: {
            element: null,
            next: 'date_to'
        },
        date_to: {
            element: null,
            prev: 'date_from',
        },
    };

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
            this.context.createQuote();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Create Sales Quote'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.searchAction();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.resetAction(this.context.searchForm);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+v', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.viewQuote();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'View'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+pageup', (event: KeyboardEvent): boolean => {
            this.context.tableService.pagination.page--;
            if (this.context.tableService.pagination.page < 1) {
                this.context.tableService.pagination.page = 1;
                return;
            }
            this.context.tableService.changePage(this.context.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Next page'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+pagedown', (event: KeyboardEvent): boolean => {
            this.context.tableService.pagination.page++;
            if (this.context.tableService.pagination.page > this.context.tableService.pagination.total_page) {
                this.context.tableService.pagination.page = this.context.tableService.pagination.total_page;
                return;
            }
            this.context.tableService.changePage(this.context.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Previous page'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));

        // this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+end', (event: KeyboardEvent): boolean => {
        //     event.preventDefault();
        //     this.context.tableService.pagination.page = this.context.tableService.pagination.total_page;
        //     this.context.tableService.changePage(this.context.tableService.pagination.page);
        //     return;
        // }, undefined, 'Move to last page'));

        // this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+home', (event: KeyboardEvent): boolean => {
        //     event.preventDefault();
        //     this.context.tableService.pagination.page = 1;
        //     this.context.tableService.changePage(this.context.tableService.pagination.page);
        //     return;
        // }, undefined, 'Move to first page'));

        // /**
        //  * SEARCH
        //  */
        // this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+s', (event: KeyboardEvent): boolean => {
        //     event.preventDefault();
        //     this.context.tableService.searchAction();
        //     return;
        // }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search data based on key'));

        // this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
        //     event.preventDefault();
        //     this.context.tableService.resetAction(this.context.searchForm);
        //     return;
        // }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset Search'));

        // this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f', (event: KeyboardEvent): boolean => {
        //     event.preventDefault();
        //     this.context.moreFilter();
        //     return;
        // }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Filter'));

    }

    getKeyConfig() {
        return this.keyConfig;
    }
}
