import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class FinancialService {

    constructor(private API: ApiService) { }

    /**
     * AR INVOICE
     */
    //

    getListInvoice(params) {
        // const url = 'ar-invoice';
        // return this.API.get(url, params);
        const url = 'ar-invoice/get-list';
        return this.API.get(url, params);
    }

    getListInvoiceItemsRef() {
        const url = 'ar-invoice/getItemInfo';
        return this.API.get(url);
    }

    getAllCustomer(params?) {
        const url = 'buyer/get-all';
        return this.API.get(url, params);
    }

    getDetailCompany(id) {
        const url = 'buyer/detail/' + id;
        return this.API.get(url);
    }

    getGenerateCode() {
        const url = 'ar-invoice/general-code';
        return this.API.get(url);
    }

    getDetailInvoice(id) {
        const url = 'ar-invoice/' + id;
        return this.API.get(url);
    }

    countInvoiceStatus() {
        // const url = 'ar-invoice/count-by-status';
        const url = 'ar-invoice/count-status';
        return this.API.get(url);
    }

    getInvoiceStatus() {
        const url = 'ar-invoice/reference-list';
        return this.API.get(url);
    }

    createInvoice(params) {
        const url = 'ar-invoice/createInvoice';
        return this.API.post(url, params);
    }

    updateInvoice(id, params) {
        const url = 'ar-invoice/updateInvoice/' + id;
        return this.API.put(url, params);
    }

    updateInvoiceStatus(id, params) {
        const url = 'ar-invoice/change-status/' + id;
        return this.API.put(url, params);
    }

    deleteInvoice(id) {
        const url = 'ar-invoice/' + id;
        return this.API.delete(url);
    }
    getNote(params) {
        const url = 'ar-invoice/set-note-message';
        return this.API.get(url, params);
    }
    getPdfPrint(url) {
        return this.API.get(url);
    }
    getListPaymentTerm() {
        const url = ['payment-term?app=inv'];
        return this.API.get(url);
    }

    getOrderByCustomerId(params) {
        const url = 'ar-invoice/get-order';
        return this.API.get(url, params);
    }

    getInvoiceDueDate(params) {
        const url = 'ar-invoice/set-due-date';
        return this.API.get(url, params);
    }

    getListApprover(params) {
        const url = 'user/search';
        return this.API.post(url, params);
    }
    getEarlyPaymentValue(issue_dt, payment_term_id, total_due) {
        const url = `ar-invoice/set-early-payment-value?issue_dt=${issue_dt}&payment_term_id=${payment_term_id}&total_due=${total_due}`;
        return this.API.get(url);
    }
    printPDF(id) {
        const url = 'ar-invoice/export-invoice/' + id;
        return url;
    }
    getPaymentMethod() {
        const url = 'ar-invoice/get-payment-method';
        return this.API.get(url);
    }
    sendMail(id, params) {
        const url = 'ar-invoice/send-email/' + id;
        return this.API.post(url, params);
    }
    updatePOD(id, params) {
        const url = 'ar-invoice/update-pod-sign-off-date/' + id;
        return this.API.put(url, params);
    }
    getListCreditMemo(id) {
        const url = 'ar-invoice/credit-memo/' + id ;
        return this.API.get(url);
    }
    getListDebitMemo(id) {
        const url = 'ar-invoice/debit-memo/' + id ;
        return this.API.get(url);
    }
    getListReceiptVoucher(id) {
        const url = 'ar-invoice/voucher/' + id ;
        return this.API.get(url);
    }
    syncInvoiceToQuickbook(invoiceId) {
        const url = `quick-books/sync-invoice/${invoiceId}?force=true`;
        return this.API.postBackground(url);
    }
    syncReceiptVoucherToQuickbook(voucherId) {
        const url = `quick-books/sync-payment/${voucherId}?force=true`;
        return this.API.postBackground(url);
    }
    syncDebitToQuickbook(debitId) {
        const url = `quick-books/sync-debit-memo/${debitId}?force=true`;
        return this.API.postBackground(url);
    }
    syncCreditToQuickbook(creditId) {
        const url = `quick-books/sync-credit-memo/${creditId}?force=true`;
        return this.API.postBackground(url);
    }
    getInvoiceHistory(id) {
        const url = ['ar-invoice/history', id].join('/');
        return this.API.get(url);
    }
    getReceiptVoucherHistory(id) {
        const url = ['voucher/history', id].join('/');
        return this.API.get(url);
    }
    getSettingInfoQuickbook() {
        const url = 'quick-books/oauth2/settings';
        return this.API.get(url);
    }
    checkPOD(id) {
        const url = 'ar-invoice/check-update-pod/' + id;
        return this.API.get(url);
    }
}
