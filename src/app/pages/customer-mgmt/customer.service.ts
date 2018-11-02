import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class CustomerService {

    constructor(private API: ApiService) { }

    getListCountry() {
        const url = 'country/get-all';
        return this.API.get(url);
    }

    getListBuyerType() {
        const url = 'company_type/all';
        return this.API.get(url);
    }

    getOrderReference() {
        const url = 'order/reference-data';
        return this.API.get(url);
    }

    getRMAReference() {
        const url = 'return-order/reference';
        return this.API.get(url);
    }
    /**
     * Buyer
     */
    //  supplier
    getListState() {
        const url = 'state/get-all';
        return this.API.get(url);
    }
    getSalePriceList() {
        const url = 'sale-price/get-list-option';
        return this.API.get(url);
    }
    getListBuyer(params) {
        const url = 'buyer/index';
        return this.API.get(url, params);
    }
    deleteBuyer(id) {
        const url = 'buyer/delete/' + id;
        return this.API.delete(url);
    }
    getDetailBuyer(id) {
        const url = 'buyer/detail/' + id;
        return this.API.get(url);
    }
    getStateByCountry(params) {
        const url = 'state/get-by-country';
        return this.API.get(url, params);
    }
    deleteAddress(params) {
        const url = 'buyer/delete-address';
        return this.API.deleteWithParam(url, params);
    }

    getListAddress(params) {
        const url = 'buyer/index';
        return this.API.get(url, params);
    }

    getListContact(params) {
        const url = 'buyer/index';
        return this.API.get(url, params);
    }

    getListSite(params) {
        const url = 'buyer/index';
        return this.API.get(url, params);
    }

    getListQuote(id, params) {
        const url = 'buyer/sale-quote/' + id;
        return this.API.get(url, params);
    }

    getListSO(id, params) {
        const url = 'buyer/sales-orders/' + id;
        return this.API.get(url, params);
    }

    getListInvoice(id, params) {
        const url = 'buyer/invoice/' + id;
        return this.API.get(url, params);
    }

    getListShipment(params) {
        const url = 'buyer/index';
        return this.API.get(url, params);
    }

    getListPayment(id, params) {
        const url = 'buyer/payment/' + id;
        return this.API.get(url, params);
    }

    exportReceiptVoucher(id) {
        const url = 'buyer/export-receipt-voucher/' + id;
        return this.API.get(url);
    }

    getListRMA(id, params) {
        const url = 'buyer/return-order/' + id;
        return this.API.get(url, params);
    }

    exportRMA(id, params) {
        const url = 'buyer/return-order/' + id + '?export=1';
        return this.API.get(url, params);
    }

    getListAccount(params) {
        const url = 'buyer/index';
        return this.API.get(url, params);
    }

    getListCard(params) {
        const url = 'buyer/index';
        return this.API.get(url, params);
    }

    getDetailCustomer(id) {
        const url = 'buyer/' + id;
        return this.API.get(url);
    }
    getDetailCustomerEdit(id) {
        const url = 'buyer/' + id + '/edit';
        return this.API.get(url);
    }

    /**
     * CUSTOMER
     */

    getCreditCard() {
        return this.API.get('buyer/credit-card-types');
    }

    createCustomer(data) {
        const url = 'buyer';
        return this.API.post(url, data);
    }
    updateCustomer(id, data) {
        const url = 'buyer/' + id;
        return this.API.put(url, data);
    }
    getListCountryAdmin() {
        const url = 'country/admin/get-all';
        return this.API.get(url);
    }
    generateSiteCode() {
        const url = 'buyer/generate-code';
        return this.API.get(url);
    }

    getListCustomerType() {
        const url = 'buyer/type';
        return this.API.get(url);
    }

    getListBank() {
        const url = 'bank/list';
        return this.API.get(url);
    }

    getListBranchByBank(bank_id) {
        const url = 'bank/' + bank_id + '/branch/list';
        return this.API.get(url);
    }

    getRoute() {
        const url = 'buyer/list-route-gate-time';
        return this.API.get(url);
    }
    getListPaymentTerm() {
        const url = 'buyer/payment-terms';
        return this.API.get(url);
    }
    getListPaymentMethod() {
        const url = 'buyer/payment-methods';
        return this.API.get(url);
    }
    getListCustomerBalanceReference() {
        const url = 'customer-balance/get-reference';
        return this.API.get(url);
    }
    getListCustomerBalance(id, params) {
        const url = 'customer-balance/get-list?company_id=' + id;
        return this.API.get(url, params);
    }
    getListCreditMemo(id, params) {
        const url = 'buyer/credit-memo/' + id;
        return this.API.get(url, params);
    }
    exportCreditMemo(id) {
        const url = 'buyer/export-credit-memo/' + id;
        return this.API.get(url);
    }
}
