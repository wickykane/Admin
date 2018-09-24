import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Helper } from './common.helper';

@Injectable()
export class KeyboardBaseService implements OnDestroy {
    public context: any;
    public _hotkeysService;
    public watchContext = new Subject<any>();

    public keyConfig = {};

    constructor(public helper: Helper) {
        this.watchContext.subscribe(res => {
            this.context = res.context;
            this._hotkeysService = res.service;
            this.initKey();
        });
    }

    getKeys() {
        return Array.from(this._hotkeysService.hotkeys);
    }

    resetKeys() {
        const keys = Array.from(this._hotkeysService.hotkeys);
        keys.map(key => {
            this._hotkeysService.remove(key);
        });
    }

    initKey() { }

    getKeyConfig() {
        return this.keyConfig;
    }

    ngOnDestroy(): void {
        this.resetKeys();
    }
}
