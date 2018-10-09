import { Injectable, OnDestroy } from '@angular/core';
import { KeyboardBaseService } from './../../../../shared/helper/keyServiceBase';

@Injectable()
export class InvoiceEditKeyService extends KeyboardBaseService {
    keyConfig = {
        company_id: {
            element: null,
            ng_select: true
        },
        contact_user_id: {
            element: null,
        },
        customer_po: {
            element: null,
        },
        type: {
            element: null,
        },
    };

    initKey() {
        // this._hotkeysService.add(new Hotkey('alt+n', (event: KeyboardEvent): boolean => {
        //     event.preventDefault();
        //     this.context.createOrder();
        //     return;
        // }, undefined, 'Create Quotation'));
    }
}
