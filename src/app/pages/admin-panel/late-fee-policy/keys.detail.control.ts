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
        this._hotkeysService.add(new Hotkey('alt+backspace', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.backToList();
            return;
        }, undefined, 'Back'));
        if (this.context.listMaster['permission'].edit && this.context.isView && (this.context.currentStatus !== 2)) {
            this._hotkeysService.add(new Hotkey('alt+e', (event: KeyboardEvent): boolean => {
                event.preventDefault();
                this.context.editLateFeePolicy(this.context.generalForm.value['id']);
                return;
            }, undefined, 'Edit'));
        }
        if (this.context.listMaster['permission'].create && !this.context.isView) {
            this._hotkeysService.add(new Hotkey('alt+s', (event: KeyboardEvent): boolean => {
                event.preventDefault();
                if (this.context.generalForm.valid || this.context.isValidLateFeePolicy()) {
                    this.context.payloadData();
                }
                return;
            }, undefined, 'Save'));
        }
    }
}
