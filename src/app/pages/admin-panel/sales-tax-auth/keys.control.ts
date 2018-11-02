import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { KeyboardBaseService } from './../../../shared/helper/keyServiceBase';
@Injectable()
export class SaleTaxKeyService extends KeyboardBaseService {
    keyConfig = {
        onClickNew: {
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

        if (this.context.listMaster['permission'].create) {
            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+c', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
                (document.activeElement as HTMLInputElement).blur();
                this.context.onClickNew('country');
                const e: ExtendedKeyboardEvent = event;
                e.returnValue = false; // Prevent bubbling
                return e;
            }, ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'], 'Create New Country'));
        }

        if (this.context.listMaster['permission'].create) {
            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+d', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
                (document.activeElement as HTMLInputElement).blur();
                if (this.context.selectedCountryTax['display_name']) {
                    this.context.onClickNew('state');
                }
                const e: ExtendedKeyboardEvent = event;
                e.returnValue = false; // Prevent bubbling
                return e;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Create New State'));
        }

        if (this.context.listMaster['permission'].create || this.context.listMaster['permission'].edit || this.context.listMaster['permission'].view) {
            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
                if (this.context.selectedCountryTax) {
                    this.context.onClickReset();
                }
                const e: ExtendedKeyboardEvent = event;
                e.returnValue = false; // Prevent bubbling
                return e;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset & Cancel Item'));
        }

        if (this.context.listMaster['permission'].create || this.context.listMaster['permission'].edit) {
            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+s', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
                (document.activeElement as HTMLElement).blur();
                if (this.context.currentForm && this.context.selectedCountryTax) {
                    this.context.onSaveTaxAuthority();
                }
                const e: ExtendedKeyboardEvent = event;
                e.returnValue = false; // Prevent bubbling
                return e;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Save'));
        }
    }

}
