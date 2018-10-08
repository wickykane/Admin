import { Injectable } from '@angular/core';
import { KeyboardBaseService } from './../../../shared/helper/keyServiceBase';

@Injectable()
export class InvoiceKeyService extends KeyboardBaseService {

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
    }
}
