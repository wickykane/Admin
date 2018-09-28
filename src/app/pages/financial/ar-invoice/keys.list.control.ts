import { Injectable } from '@angular/core';
import { KeyboardBaseService } from './../../../shared/helper/keyServiceBase';

@Injectable()
export class InvoiceKeyService extends KeyboardBaseService {

    keyConfig = {
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

    initKey() {
    }
}
