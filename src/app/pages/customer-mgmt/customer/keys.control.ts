import { Subject } from 'rxjs/Rx';
import { Injectable, OnDestroy } from '@angular/core';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
@Injectable()
export class CustomerKeyService implements OnDestroy {
    public context: any;
    public watchContext = new Subject<any>();

    constructor(private _hotkeysService: HotkeysService) {
        this.watchContext.subscribe(res => {
            this.context = res;
            this.initKey();
        })
    }

    ngOnDestroy() {
        this._hotkeysService.reset()
    }

    getKeys() {
        return this._hotkeysService.hotkeys;
    }

    initKey() {
        this._hotkeysService.add(new Hotkey('F1', (event: KeyboardEvent): boolean => {
            return;
        }, undefined, 'Edit'));
        this._hotkeysService.add(new Hotkey('F2', (event: KeyboardEvent): boolean => {
            return;
        }, undefined, 'Back to list'));

    }
}