import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/index';

@Injectable()
export class ReceiptVoucherService {

    constructor(private API: ApiService) { }

    /**
     * RECEIPT SERVICE
     */
    //
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

}
