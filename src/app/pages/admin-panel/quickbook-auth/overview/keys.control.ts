import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { KeyboardBaseService } from './../../../../shared/helper/keyServiceBase';
@Injectable()
export class QuickbookKeyService extends KeyboardBaseService {
    keyConfig = {
    };

    initKey() {
        if (this.context.settingInfo.state !== 'authorized') {
            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+i', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
                (document.activeElement as HTMLElement).blur();
                this.context.onClickInstall();
                const e: ExtendedKeyboardEvent = event;
                e.returnValue = false; // Prevent bubbling
                return e;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Install'));
        }

        if (this.context.settingInfo.state === 'authorized') {
            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+u', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
                (document.activeElement as HTMLElement).blur();
                this.context.onClickUninstall();
                const e: ExtendedKeyboardEvent = event;
                e.returnValue = false; // Prevent bubbling
                return e;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Uninstall'));
        }
    }

}
