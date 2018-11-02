import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { KeyboardBaseService } from '../../shared/helper/keyServiceBase';
@Injectable()
export class ShippingZoneModalKeyService extends KeyboardBaseService {
    keyConfig = {
        name: {
            element: null,
            focus: true,
        },
        filter: {
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
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+c', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            this.context.closeX();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Cancel'));
        if (!this.context.isView) {
            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+s', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
                (document.activeElement as HTMLElement).blur();
                if (this.context.generalForm.value.id !== '4') {
                    if (!this.context.generalForm.invalid) {
                        this.context.applyData();
                    } else if (this.context.generalForm.value.id === '5') {
                        this.context.applyData();
                    }
                } else {
                    if (!this.context.checkAllBussinessHour()) {
                        this.context.applyData();
                    }
                }

                const e: ExtendedKeyboardEvent = event;
                e.returnValue = false; // Prevent bubbling
                return e;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Submit'));
        }
    }
}
