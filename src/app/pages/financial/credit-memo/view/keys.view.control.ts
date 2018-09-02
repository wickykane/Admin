import { Injectable } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs/Rx';

@Injectable()
export class InvoiceDetailKeyService {
    public context: any;
    public _hotkeysService;
    public watchContext = new Subject<any>();

    private keyConfig = {
        company_id: {
            element: null,
            prev: 'contact_user_id',
            next: 'customer_po',
        },
        contact_user_id: {
            element: null,
            prev: 'company_id',
            next: 'contact_user_id',
        },
        customer_po: {
            element: null,
            prev: 'company_id',
            next: 'type',
        },
        type: {
            element: null,
            prev: 'customer_po',
            next: 'type',
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
