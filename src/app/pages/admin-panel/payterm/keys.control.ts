import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { KeyboardBaseService } from './../../../shared/helper/keyServiceBase';
@Injectable()
export class PayTermKeyService extends KeyboardBaseService {
    initKey() {
        // this.resetKeys();
        // this._hotkeysService.add(new Hotkey('ctrl+f', (event: KeyboardEvent): any => {
        //     event.preventDefault();
        //     this.context.tableService.searchAction();
        //     event.returnValue = false;
        //     return event;
        // }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));
        // this._hotkeysService.add(new Hotkey('ctrl+r', (event: KeyboardEvent): any => {
        //     event.preventDefault();
        //     this.context.tableService.resetAction(this.context.searchForm);
        //     event.returnValue = false;
        //     return event;
        // }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));

    }
}
