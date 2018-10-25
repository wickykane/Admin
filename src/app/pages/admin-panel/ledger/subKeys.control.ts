import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { KeyboardBaseService } from '../../../shared/helper/keyServiceBase';
@Injectable()
export class LedgerSubKeyService extends KeyboardBaseService {
    keyConfig = {
        description: {
            element: null,
            focus: true,
            ng_select: true,
        },
    };

    saveKeys() {
        this.keys = this.getKeys();
        this.context.data['tableKey'] = this.context.table.getKeys();
        this.resetKeys();
        this.context.table.resetKeys();
    }


    initKey() {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+n', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.createRMA();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Create Account'));
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.getList();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.resetAction(this.context.searchForm);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));

            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+v', (event: KeyboardEvent): boolean => {
                event.preventDefault();
                this.context.detailRMA();
                return;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'View Return Order'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+w', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.detailOrder();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'View Order'));


        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));

    }
}
