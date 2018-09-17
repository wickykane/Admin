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

    getListReceiptVoucher(params) {
        const url = 'receipt-voucher';
        return this.API.get(url, params);
    }

    getListMasterForReceiptVoucher() {
        const url = ['receipt-voucher', 'refer'].join('/');
        return this.API.get(url);
    }

    getDetailReceiptVoucher(id) {
        const url = ['receipt-voucher', id].join('/');
        return this.API.get(url);
    }

    getLogReceiptVoucher(id, params) {
        const url = ['receipt-voucher', 'log', id].join('/');
        return this.API.get(url, params);
    }

    updateReceiptVoucherStatus(id, params) {
        const url = ['receipt-voucher', id].join('/');
        return this.API.put(url, params);
    }

    getVoucherMasterData() {
        const url = 'voucher/master-data';
        return this.API.get(url);
    }

    getListAccountGL() {
        const url = ['account', 'getAccountTree'].join('/');
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
