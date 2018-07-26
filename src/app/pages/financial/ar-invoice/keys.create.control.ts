import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs/Rx';

@Injectable()
export class InvoiceCreateKeyService implements OnDestroy {
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
        this._hotkeysService.add(new Hotkey('shift+d', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.payloadData('draft');
            return;
        }, undefined, 'Save As Draft'));
        this._hotkeysService.add(new Hotkey('shift+s', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.payloadData('submit');
            return;
        }, undefined, 'Save & Submit'));
        this._hotkeysService.add(new Hotkey('shift+c', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.payloadData('createnew');
            return;
        }, undefined, 'Save & Create New Invoice'));
    }
}
