import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { KeyboardBaseService } from './../../../shared/helper/keyServiceBase';
@Injectable()
export class ReturnReasonKeyService extends KeyboardBaseService {

    keyConfig = {
        code: {
            element: null,
            focus: true,
        },
    };

    initKey() {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            if (this.keyConfig.code.element) {
                this.keyConfig.code.element.nativeElement.focus();
            }
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus Search'));

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

        if (this.context.listMaster['permission'].create) {
            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+n', (event: KeyboardEvent): boolean => {
                event.preventDefault();
                this.context.createReturnReason();
                return;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'New Return Reason'));
        }

        if (this.context.listMaster['permission'].edit) {
            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+v', (event: KeyboardEvent): boolean => {
                event.preventDefault();
                const item = this.context.list.items[this.context.selectedIndex];
                if (item) {
                    this.context.editReturnReason(item.id);
                }
                return;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Edit'));
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
