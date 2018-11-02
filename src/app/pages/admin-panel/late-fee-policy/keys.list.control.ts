import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { KeyboardBaseService } from '../../../shared/helper/keyServiceBase';


@Injectable()
export class LateFeePolicyListKeyService extends KeyboardBaseService {

    saveKeys() {
        this.keys = this.getKeys();
        this.context.data['tableKey'] = this.context.table.getKeys();
        this.resetKeys();
        this.context.table.resetKeys();
    }

    initKey() {
        if (this.context.listMaster['permission'].create) {
            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+n', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
                (document.activeElement as HTMLElement).blur();
                this.context.createLateFeePolicy();
                const e: ExtendedKeyboardEvent = event;
                e.returnValue = false; // Prevent bubbling
                return e;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Create Policy'));
        }
        if (this.context.listMaster['permission'].edit) {
            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
                (document.activeElement as HTMLElement).blur();
                this.context.editLateFeePolicy();
                const e: ExtendedKeyboardEvent = event;
                e.returnValue = false; // Prevent bubbling
                return e;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Edit Policy'));
        }
        if (this.context.listMaster['permission'].view) {
            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+v', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
                (document.activeElement as HTMLElement).blur();
                this.context.viewLateFeePolicy();
                const e: ExtendedKeyboardEvent = event;
                e.returnValue = false; // Prevent bubbling
                return e;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'View Policy'));
        }

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+s', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.searchAction();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.resetAction(this.context.searchForm);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));
    }
}
