import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Helper } from '../../../../shared/index';

@Injectable()
export class SaleQuoteCreateKeyService implements OnDestroy {
    public context: any;
    public _hotkeysService: HotkeysService;
    public loaded;
    public watchContext = new Subject<any>();

    private keyConfig = {
        company_id: {
            element: null,
            focus: true,
            ng_select: true,
        },
    };

    constructor(public helper: Helper) {
        this.watchContext.subscribe(res => {
            this.context = res.context;
            this._hotkeysService = res.service;
            this.initKey();
            this.loaded = true;
        });
    }

    getKeys() {
        return Array.from(this._hotkeysService.hotkeys);
    }

    getKeyConfig() {
        return this.keyConfig;
    }

    initKey() {
        this.resetKeys();
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            this.context.selectTable();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+i', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            if (this.context.data['modal']) {
                return;
            }
            this.context.data['modal'] = true;
            (document.activeElement as HTMLInputElement).blur();
            setTimeout(() => {
                this.context.addNewItem();
            });

            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Add Item'));
    }

    ngOnDestroy() {
        this.resetKeys();
    }

    resetKeys() {
        const keys = Array.from(this._hotkeysService.hotkeys);
        keys.map(key => {
            this._hotkeysService.remove(key);
        });
    }
}
