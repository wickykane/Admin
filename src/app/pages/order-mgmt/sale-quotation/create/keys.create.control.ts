import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey } from 'angular2-hotkeys';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SaleQuoteCreateKeyService {
    public context: any;
    public _hotkeysService;
    public watchContext = new Subject<any>();

    private keyConfig = {
        company_id: {
            element: null,
            focus: true,
        },
    };

    constructor() {
        this.watchContext.subscribe(res => {
            this.context = res.context;
            this._hotkeysService = res.service;
            this.initKey();
        });
    }

    getKeys() {
        return Array.from(this._hotkeysService.hotkeys);
    }

    getKeyConfig() {
        return this.keyConfig;
    }

    initKey() {
        // this._hotkeysService.add(new Hotkey('alt+n', (event: KeyboardEvent): boolean => {
        //     event.preventDefault();
        //     this.context.createOrder();
        //     return;
        // }, undefined, 'Create Quotation'));
    }
}
