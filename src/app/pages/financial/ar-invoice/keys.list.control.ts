import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs/Rx';

@Injectable()
export class InvoiceKeyService implements OnDestroy {
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
        this._hotkeysService.add(new Hotkey('shift+n', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.createInvoice();
            return;
        }, undefined, 'Create Invoice'));
        this._hotkeysService.add(new Hotkey('shift+e', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.editInvoice();
            return;
        }, undefined, 'Edit Invoice'));
        this._hotkeysService.add(new Hotkey('shift+v', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.viewInvoice();
            return;
        }, undefined, 'View Invoice'));
        this._hotkeysService.add(new Hotkey('shift+s', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.tableService.searchAction();
            event.returnValue = false;
            return event;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));
        this._hotkeysService.add(new Hotkey('shift+r', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.tableService.resetAction(this.context.searchForm);
            event.returnValue = false;
            return event;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));
    }
}
