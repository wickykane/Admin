import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs/Rx';
import { KeyboardBaseService } from './../../../shared/helper/keyServiceBase';
@Injectable()
export class DiscountCategoryKeyService extends KeyboardBaseService {
    // resetKeys() {
    //     const keys = this.getKeys();
    //     for (const key of keys) {
    //         this._hotkeysService.remove(key);
    //     }
    // }

    // getKeys() {
    //     return Array.from(this._hotkeysService.hotkeys);
    // }
    // keyConfig = {
    //     receipt_no: {
    //         element: null,
    //         focus: true,
    //     }
    // };

    initKey() {
        // this.resetKeys();
        if (this.context.listMaster['permission'].create) {
            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+n', (event: KeyboardEvent): boolean =>  {
                event.preventDefault();
                this.context.createDiscountCategory();
                return;
            }, undefined, 'Create New'));
        }

        if (this.context.listMaster['permission'].edit) {
            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent): boolean =>  {
                event.preventDefault();
                this.context.editDiscountCategory();
                return;
            }, undefined, 'Edit'));
        }
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+pagedown', (event: KeyboardEvent): boolean => {
            this.context.tableService.pagination.page++;
            if (this.context.tableService.pagination.page > this.context.tableService.pagination.total_page) {
                this.context.tableService.pagination.page = this.context.tableService.pagination.total_page;
                return;
            }
            this.context.tableService.changePage(this.context.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Next page'));
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+pageup', (event: KeyboardEvent): boolean => {
            this.context.tableService.pagination.page--;
            if (this.context.tableService.pagination.page < 1) {
                this.context.tableService.pagination.page = 1;
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
    }
}
