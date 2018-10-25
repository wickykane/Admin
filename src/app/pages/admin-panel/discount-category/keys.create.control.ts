import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
// tslint:disable-next-line:import-blacklist

import { KeyboardBaseService } from './../../../shared/helper/keyServiceBase';
@Injectable()
export class DiscountCategoryCreateKeyService extends KeyboardBaseService {

    keyConfig = {
        description: {
            element: null,
            focus: true,
        }
    };

    initKey() {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            if (this.keyConfig.description.element) {
                this.keyConfig.description.element.nativeElement.focus();
            }
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus Search'));

        // this.resetKeys();
        this._hotkeysService.add(new Hotkey('alt+backspace', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.reback();
            return;
        }, undefined, 'Back'));
        if (this.context.listMaster['permission'].create) {
            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+s', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
                (document.activeElement as HTMLElement).blur();
                if (!this.context.generalForm.invalid || !this.context.myForm.invalid) {
                    this.context.createDiscountCategory();
                }
                const e: ExtendedKeyboardEvent = event;
                e.returnValue = false; // Prevent bubbling
                return e;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Save'));

        }
    }
}
