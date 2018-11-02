import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { KeyboardBaseService } from './../../../shared/helper/keyServiceBase';
@Injectable()
export class LedgerKeyService extends KeyboardBaseService {
    keyConfig = {
        description: {
            element: null,
            focus: true,
            ng_select: true,
        },
        account_no: {
            element: null,
            focus: true,
            ng_select: true,
        }
    };

    saveKeys() {
        this.keys = this.getKeys();
        this.context.data['tableKey'] = this.context.table.getKeys();
        this.resetKeys();
        this.context.table.resetKeys();
    }


    initKey() {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+backspace', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            this.context.back();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Back'));
        if (this.context.listMaster['permission'].create) {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+a', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            if (!(!this.context.data['selectedAccount'] || this.context.data['selectedAccount'] && this.context.data['selectedAccount'].level !== 0)) {
                this.context.actionInvoke(this.context.screen.NEW_ACCOUNT_TYPE);
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'], 'Add Account Type'));
    }
    if (this.context.listMaster['permission'].sync) {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+q', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            this.context.syncToQuickbook();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'], 'Sync To QB'));
    }
    if (this.context.listMaster['permission'].create) {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+a', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            if (!(!this.context.data['selectedAccount'] || this.context.data['selectedAccount'] && this.context.data['selectedAccount'].level !== 1)) {
                this.context.actionInvoke(this.context.screen.NEW_DETAIL_TYPE);
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'], 'Add Detail Type'));
    }

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+c', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            if (this.context.data['show']) {
                this.context.cancel();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Cancel'));
        if (this.context.listMaster['permission'].edit) {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+s', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            console.log(this.context.data['show'], this.context.screen, this.context.generalForm.valid);
            if (this.context.data['show'] == this.context.screen.NEW_ACCOUNT_TYPE || this.context.data['show'] == this.context.screen.VIEW_ACCOUNT_TYPE) {
                if (this.context.generalForm.valid) {
                    this.context.saveAccountType();
                }
            } else if (this.context.data['show'] == this.context.screen.NEW_DETAIL_TYPE) {
                if (this.context.generalForm.valid) {
                    this.context.saveDetailAccountType();
                }
            } else if (this.context.data['show'] == this.context.screen.VIEW_DETAIL_TYPE) {
                if (!this.context.generalForm.valid) {
                    this.context.saveDetailAccountType();
                }
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Save'));
    }
        this._hotkeysService.add(new Hotkey('alt+pagedown', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.selectTab(1);
            return;
        }, undefined, 'Next Tab'));

        this._hotkeysService.add(new Hotkey('alt+pageup', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.selectTab(-1);
            return;
        }, undefined, 'Prev Tab'));
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+n', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            console.log(this.context.tabSet);
            if (this.context.tabSet.activeId === '1') {
                this.context.newAccount();
            }
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Create Account'));
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            if (this.keyConfig.account_no.element) {
                this.keyConfig.account_no.element.nativeElement.focus();
            }
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus Search'));
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.getList();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.resetAction(this.context.searchForm);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));
        if (this.context.listMaster['permission'].edit) {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+v', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            const index = this.context.selectedIndex;
            const item = this.context.list.items[index];
            this.context.newAccount(item);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Edit'));
    }
    if (this.context.listMaster['permission'].edit) {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+w', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.detailOrder();
            const index = this.context.selectedIndex;
            const item = this.context.list.items[index];
            this.context.deleteAccount(item.id);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Delete'));
    }

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));

    }
}
