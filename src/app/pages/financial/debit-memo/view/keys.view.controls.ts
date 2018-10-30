import { Injectable } from '@angular/core';
import { Hotkey } from 'angular2-hotkeys';
import { KeyboardBaseService } from './../../../../shared/helper/keyServiceBase';

@Injectable()
export class DebitMemoViewKeyService extends KeyboardBaseService {

    keyConfig = {
        back_button: {
            element: null,
            focus: true,
        },
    };

    initKey() {
        this._hotkeysService.add(new Hotkey('alt+backspace', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.back();
            return;
        }, undefined, 'Back'));

        this._hotkeysService.add(new Hotkey('alt+pagedown', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.changeTab(1);
            return;
        }, undefined, 'Next Tab'));

        this._hotkeysService.add(new Hotkey('alt+pageup', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.changeTab(-1);
            return;
        }, undefined, 'Prev Tab'));
    }
}
