import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey } from 'angular2-hotkeys';
import { KeyboardBaseService } from '../../../../shared/helper/keyServiceBase';
@Injectable()
export class ShippingZoneKeyService extends KeyboardBaseService {
    keyConfig = {
        zone_name: {
            element: null,
            focus: true,
        }
    };

    initKey() {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            if (this.keyConfig.zone_name.element) {
                this.keyConfig.zone_name.element.nativeElement.focus();
            }
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus Search'));
        if (this.context.listMaster['permission'].create) {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+n', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.createShippingZone();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Create Shipping Zone'));
    }
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
        if (this.context.listMaster['permission'].view) {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+v', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            const id = this.context.list.items[this.context.selectedIndex].id;
            this.context.openViewPage(id);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'View'));
    }
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+pageup', (event: KeyboardEvent): boolean => {
            this.context.tableService.pagination.page--;
            if (this.context.tableService.pagination.page < 1) {
                this.context.tableService.pagination.page = 1;
                return;
            }
            this.context.tableService.changePage(this.context.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Previous page'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+pagedown', (event: KeyboardEvent): boolean => {
            this.context.tableService.pagination.page++;
            if (this.context.tableService.pagination.page > this.context.tableService.pagination.total_page) {
                this.context.tableService.pagination.page = this.context.tableService.pagination.total_page;
                return;
            }
            this.context.tableService.changePage(this.context.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Next page'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));
    }
}
