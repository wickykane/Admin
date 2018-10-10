import { Injectable } from '@angular/core';
import { Hotkey } from 'angular2-hotkeys';
import { KeyboardBaseService } from '../../../shared/helper/keyServiceBase';
import { Helper } from './../../../shared/helper/common.helper';


@Injectable()
export class ItemKeyService extends KeyboardBaseService {

    keyConfig = {};

    initKey() {
        this._hotkeysService.add(new Hotkey('ctrl+1', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.selectTab('vin');
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search by VIN'));

        this._hotkeysService.add(new Hotkey('ctrl+2', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.selectTab('vehicle');
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search by Vehicle'));

        this._hotkeysService.add(new Hotkey('ctrl+3', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.selectTab('part_number');
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search by Part Number'));

        this._hotkeysService.add(new Hotkey('alt+pagedown', (event: KeyboardEvent): boolean => {
            this.context.tableService.pagination.page++;
            if (this.context.tableService.pagination.page > this.context.tableService.pagination.total_page) {
                this.context.tableService.pagination.page = this.context.tableService.pagination.total_page;
                return;
            }
            this.context.tableService.changePage(this.context.tableService.pagination.page);
            return;
        }, undefined, 'Next page'));

        this._hotkeysService.add(new Hotkey('alt+pageup', (event: KeyboardEvent): boolean => {
            this.context.tableService.pagination.page--;
            if (this.context.tableService.pagination.page < 1) {
                this.context.tableService.pagination.page = 1;
                return;
            }
            this.context.tableService.changePage(this.context.tableService.pagination.page);
            return;
        }, undefined, 'Prev page'));

        //  this._hotkeysService.add(new Hotkey('alt+end', (event: KeyboardEvent): boolean => {
        //      event.preventDefault();
        //      this.context.tableService.pagination.page = this.context.tableService.pagination.total_page;
        //      this.context.tableService.changePage(this.context.tableService.pagination.page);
        //      return;
        //  }, undefined, 'Move to last page'));
        //
        //  this._hotkeysService.add(new Hotkey('alt+home', (event: KeyboardEvent): boolean => {
        //      event.preventDefault();
        //      this.context.tableService.pagination.page = 1;
        //      this.context.tableService.changePage(this.context.tableService.pagination.page);
        //      return;
        //  }, undefined, 'Move to first page'));

        /**
         * SEARCH
         */
        this._hotkeysService.add(new Hotkey('alt+s', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.searchAction();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));

        this._hotkeysService.add(new Hotkey('alt+r', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.resetAction(this.context.searchForm);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));

        this._hotkeysService.add(new Hotkey('alt+f', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.searchAction();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Filter'));


        this._hotkeysService.add(new Hotkey('alt+shift+r', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.resetAction(this.context.filterForm);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset Filter'));

        this._hotkeysService.add(new Hotkey('alt+m', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            return;
        }, undefined, 'Mass Update Price'));
    }
}
