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

    getPaymentMethodElectronic(id) {
        const url = 'voucher/payment-method-by-electronic/' + id;
        return this.API.get(url);
    }

    getListReceiptVoucher(params) {
        const url = ['voucher', 'list'].join('/');
        return this.API.get(url, params);
    }

    getDetailReceiptVoucher(id) {
        const url = ['voucher', 'view', id].join('/');
        return this.API.get(url);
    }

    getLogReceiptVoucher(id, params) {
        const url = ['receipt-voucher', 'log', id].join('/');
        return this.API.get(url, params);
    }

    updateReceiptVoucherStatus(params) {
        const url = ['voucher', 'change-status'].join('/');
        return this.API.post(url, params);
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
        const url = 'voucher/get-line-item';
        return this.API.get(url, params);
    }

    getListInvoiceAndMemoById(id, params) {
        const url = 'voucher/get-line-item/' + id;
        return this.API.get(url, params);
    }

    createVoucher(params) {
        const url = 'voucher/create';
        return this.API.post(url, params);
    }
    countVoucherStatus() {
        const url = ['voucher', 'status-list'].join('/');
        return this.API.get(url);
    }

    updateVoucher(id, params) {
        const url = 'voucher/update/' + id;
        return this.API.put(url, params);
    }

    getPaymentMethodOption() {
        const url = 'sale-quote/sq-references';
        return this.API.get(url);
    }
}
