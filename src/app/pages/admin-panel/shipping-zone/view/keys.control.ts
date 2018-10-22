import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { KeyboardBaseService } from './../../../../shared/helper/keyServiceBase';
@Injectable()
export class ShippingZoneViewKeyService extends KeyboardBaseService {
    keyConfig = {
        name: {
            element: null,
            focus: true,
        },
        filter : {
            element: null,
            focus: true,
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
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            if (this.keyConfig.filter.element) {
                this.keyConfig.filter.element.nativeElement.focus();
            }
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus Search'));


    }
}
