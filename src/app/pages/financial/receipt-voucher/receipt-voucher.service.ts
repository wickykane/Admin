import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/index';

@Injectable()
export class ReceiptVoucherService {

    constructor(private API: ApiService) { }

    /**
     * RECEIPT SERVICE
     */
    //
    getPaymentMethod() {
        const url = 'ar-invoice/get-payment-method';
        return this.API.get(url);
    }

    getGenerateCode() {
        const url = 'ar-invoice/general-code';
        return this.API.get(url);
    }

    getListInvoiceAndMemo(params) {
        const url = 'ar-invoice/general-code';
        return this.API.get(url, params);
    }

    createVoucher(params) {
        const url = 'ar-invoice/general-code';
        return this.API.post(url, params);
    }
}
