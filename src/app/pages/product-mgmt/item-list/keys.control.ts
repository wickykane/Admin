import { Injectable } from '@angular/core';
import { Hotkey } from 'angular2-hotkeys';
import { KeyboardBaseService } from '../../../shared/helper/keyServiceBase';
import { Helper } from './../../../shared/helper/common.helper';


@Injectable()
export class ItemKeyService extends KeyboardBaseService {

    keyConfig = {
        warehouse: {
            element: null,
            focus: true,
        },
        year_from: {
            element: null,
        },
        oem: {
            elment: null,
        },
        vin: {
            elment: null,
        },
        partlinks_no_filter: {
            element: null,
        },
        freight_class: {
            element: null,
        }
    };

    initKey() {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            const defaultConfig = {
                vin: 'vin',
                vehicle: 'year_from',
                part_number: 'oem'
            };

            const activeTab = defaultConfig[this.context.tabSet.activeId];

            if (this.keyConfig[activeTab].element) {
                this.keyConfig[activeTab].element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus Search'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+v', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            (document.activeElement as HTMLInputElement).blur();
            this.context.selectTab('vin');
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'VIN'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            (document.activeElement as HTMLInputElement).blur();
            this.context.selectTab('vehicle');
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Vehicle'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+p', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            (document.activeElement as HTMLInputElement).blur();
            this.context.selectTab('part_number');
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Part Number'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            (document.activeElement as HTMLInputElement).blur();
            if (this.keyConfig.partlinks_no_filter.element) {
                this.keyConfig.partlinks_no_filter.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus Filter'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            this.context.selectTable();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));

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
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+s', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            if (this.context.data['warehouse']) {
                this.context.tableService.searchActionWithFilter();
            }
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            if (this.context.data['warehouse']) {
                this.context.tableService.resetAction(this.context.filterForm);
                this.context.tableService.resetAction(this.context.searchForm);
            }
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));


        this._hotkeysService.add(new Hotkey('alt+2', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            if (this.context.data['warehouse']) {
                this.context.tableService.resetAction(this.context.filterForm);
            }
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset Filter'));
    }

}
