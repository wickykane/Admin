import { Injectable } from '@angular/core';
import { Hotkey } from 'angular2-hotkeys';
import { KeyboardBaseService } from './../../../../shared/helper/keyServiceBase';

@Injectable()
export class SaleOrderViewKeyService extends KeyboardBaseService {

    keyConfig = {
        back_button: {
            element: null,
            focus: true,
        },
    };

    initKey() {
        this._hotkeysService.add(new Hotkey('alt+backspace', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.cancel();
            return;
        }, undefined, 'Back'));
    }
}
