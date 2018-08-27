import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs/Rx';

@Injectable()
export class DebitMemoCreateKeyService implements OnDestroy {

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
            return event;
        }, undefined, 'Save as Draft'));
        this._hotkeysService.add(new Hotkey('f2', (event: KeyboardEvent): any => {
            event.preventDefault();
            return event;
        }, undefined, 'Save & Submit'));
        this._hotkeysService.add(new Hotkey('f3', (event: KeyboardEvent): any => {
            event.preventDefault();
            return event;
        }, undefined, 'Save & Create New'));
        this._hotkeysService.add(new Hotkey('f6', (event: KeyboardEvent): any => {
            event.preventDefault();
            return event;
        }, undefined, 'Cancel'));
        this._hotkeysService.add(new Hotkey('f7', (event: KeyboardEvent): any => {
            event.preventDefault();
            return event;
        }, undefined, 'Add Note'));
    }
}
