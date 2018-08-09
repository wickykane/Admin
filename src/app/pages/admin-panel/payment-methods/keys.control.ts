import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs/Rx';
@Injectable()
export class PaymentMethodsKeyService implements OnDestroy {
    public context: any;
    public watchContext = new Subject<any>();

    constructor(private _hotkeysService: HotkeysService) {
        this.watchContext.subscribe(res => {
            this.context = res;
            this.initKey();
        });
    }

    ngOnDestroy() {
        this.resetKeys();
    }

    resetKeys() {
        const keys = this.getKeys();
        for (const key of keys) {
            this._hotkeysService.remove(key);
        }
    }

    getKeys() {
        return Array.from(this._hotkeysService.hotkeys);
    }

    initKey() {
        this.resetKeys();
        this._hotkeysService.add(new Hotkey('f1', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.addNewPaymentMethod();
            return event;
        }, undefined, 'Add New'));
        this._hotkeysService.add(new Hotkey('f2', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.changePaymentMethodStatusMulti();
            return event;
        }, undefined, 'Active/Inactive'));
        this._hotkeysService.add(new Hotkey('f3', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.tableService.searchAction();
            event.returnValue = false;
            return event;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Execute Search'));
        this._hotkeysService.add(new Hotkey('f4', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.tableService.resetAction(this.context.searchForm);
            event.returnValue = false;
            return event;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));

    }
}
