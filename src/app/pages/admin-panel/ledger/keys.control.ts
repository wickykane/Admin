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
        // <button [disabled]="!data['selectedAccount'] || data['selectedAccount'] && data['selectedAccount'].level !== 0" (click)="actionInvoke(screen.NEW_ACCOUNT_TYPE)" class="btn btn-custom btn-orange">Add Account Type</button>
        // <button class="btn btn-custom btn-green" (click)="syncToQuickbook()">Sync to QB</button>
        // <button [disabled]="!data['selectedAccount'] || data['selectedAccount'] && data['selectedAccount'].level !== 1" (click)="actionInvoke(screen.NEW_DETAIL_TYPE)" class="btn btn-custom btn-dark">Add Detail Type</button>
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+a', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            if (!(!this.context.data['selectedAccount'] || this.context.data['selectedAccount'] && this.context.data['selectedAccount'].level !== 0)) {
                this.context.actionInvoke(this.context.screen.NEW_ACCOUNT_TYPE);
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'], 'Add Account Type'));
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+q', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            this.context.syncToQuickbook();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'], 'Sync To QB'));
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+a', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            if (!(!this.context.data['selectedAccount'] || this.context.data['selectedAccount'] && this.context.data['selectedAccount'].level !== 1)) {
                this.context.actionInvoke(this.context.screen.NEW_DETAIL_TYPE);
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'], 'Add Detail Type'));
        // this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+c', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
        //     (document.activeElement as HTMLInputElement).blur();
        //     this.context.onClickNew('country');
        //     const e: ExtendedKeyboardEvent = event;
        //     e.returnValue = false; // Prevent bubbling
        //     return e;
        // }, ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'], 'Create New Country'));

        // this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+d', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
        //     (document.activeElement as HTMLInputElement).blur();
        //     if (this.context.selectedCountryTax['display_name']) {
        //         this.context.onClickNew('state');
        //     }
        //     const e: ExtendedKeyboardEvent = event;
        //     e.returnValue = false; // Prevent bubbling
        //     return e;
        // }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Create New State'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+c', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            if (this.context.data['show']) {
                this.context.cancel();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Cancel'));

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

    }
}
