import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
// tslint:disable-next-line:import-blacklist

import { KeyboardBaseService } from '../../../../shared/helper/keyServiceBase';
@Injectable()
export class PaymentMethodCreateKeyService extends KeyboardBaseService {

    keyConfig = {
        type: {
            element: null,
            focus: true,
        }
    };

    initKey() {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            if (this.keyConfig.type.element) {
                this.keyConfig.type.element.nativeElement.focus();
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
            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+s', (event: KeyboardEvent): boolean =>  {
                event.preventDefault();
                this.context.savePaymentMethod();
                return;
            }, undefined, this.context.paymentMethodId === null ||  this.context.paymentMethodId === undefined ?  'Create' : 'Save'));
        }
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean =>  {
                event.preventDefault();
                this.context.testConnection();
                return;
            }, undefined, 'Test Connection'));
    }
}
