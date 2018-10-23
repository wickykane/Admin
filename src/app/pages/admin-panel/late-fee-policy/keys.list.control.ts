import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs/Rx';

@Injectable()
export class LateFeePolicyListKeyService implements OnDestroy {
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
        this._hotkeysService.add(new Hotkey('alt+n', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.createLateFeePolicy();
            return;
        }, undefined, 'Create Policy'));
        this._hotkeysService.add(new Hotkey('alt+e', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.editLateFeePolicy();
            return;
        }, undefined, 'Edit Policy'));
        this._hotkeysService.add(new Hotkey('alt+v', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.viewLateFeePolicy();
            return;
        }, undefined, 'View Policy'));
        this._hotkeysService.add(new Hotkey('alt+s', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.tableService.searchAction();
            event.returnValue = false;
            return event;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));
        this._hotkeysService.add(new Hotkey('alt+r', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.tableService.resetAction(this.context.searchForm);
            event.returnValue = false;
            return event;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));
        this._hotkeysService.add(new Hotkey('alt+t', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));
    }
}
