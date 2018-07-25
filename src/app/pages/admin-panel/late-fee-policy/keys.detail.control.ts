import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs/Rx';

@Injectable()
export class LateFeePolicyDetailKeyService implements OnDestroy {
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
        if (this.context['currentStatus'] !== 2) {
            this._hotkeysService.add(new Hotkey('shift+e', (event: KeyboardEvent): boolean => {
                event.preventDefault();
                this.context.editLateFeePolicy();
                return;
            }, undefined, 'Edit Policy'));
        }
        this._hotkeysService.add(new Hotkey('esc', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.backToList();
            return;
        }, undefined, 'Cancel'));
    }
}