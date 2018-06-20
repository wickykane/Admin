import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class OrderService {
    constructor(private API: ApiService) { }

    // Order

    getOrderDetail(id) {
        const url = ['order', id].join('/');
        return this.API.get(url);
    }

    getBuyerType() {
        const url = 'company_type/all';
        return this.API.get(url);
    }

    getActiveProgram(id) {
        const url = 'buyer/active-programs/' + id;
        return this.API.get(url);
    }

    getListCompany(type) {
        const url = 'buyer/index?buyer_type=' + type;
        return this.API.get(url);
    }

    getDetailCompany(id) {
        const url = 'buyer/detail/' + id;
        return this.API.get(url);
    }

    getListOrder(params) {
        const url = 'order';
        return this.API.get(url, params);
    }

    getListStatus() {
        const url = 'order/list-status';
        return this.API.get(url);
    }

    countOrderStatus() {
        const url = 'reports/order-status-count';
        return this.API.get(url);
    }


    getListBuyerRFQ(params) {
        const url = 'rfq';
        return this.API.get(url, params);
    }
    // Sale Price List
    getList(params) {
        const url = 'sale-price/get-list';
        return this.API.get(url, params);
    }
    createSalePrice(params) {
        const url = 'sale-price';
        return this.API.post(url, params);
    }
    getDetailSalePrice(id) {
        const url = 'sale-price/' + id;
        return this.API.get(url);
    }
    updateSalePrice(id, params) {
        const url = 'sale-price/' + id;
        return this.API.put(url, params);
    }

    /**
     * dELIVERY order
     */
    //
    getDeliveryCode() {
        const url = 'delivery-order/get-delivery-order-code';
        return this.API.get(url);
    }
    getOrderDelievery() {
        const url = 'order/list-order-delivery';
        return this.API.get(url);
    }
    getPickupLocation() {
        const url = 'warehouse/get-all';
        return this.API.get(url);
    }
    getProductByOrderAndAddr(params) {
        const url = 'order/list-item-order';
        return this.API.get(url, params);
    }
    createDeliveryOrder(params) {
        const url = 'delivery-order/create';
        return this.API.post(url, params);
    }
    getListDeliveryOrder(params) {
        const url = 'delivery-order/index';
        return this.API.get(url, params);
    }
    updateStatus(id) {
        const url = 'delivery-order/update/' + id;
        return this.API.post(url);
    }
    getDetailDeliveryOrder(id) {
        const url = 'delivery-order/detail/' + id;
        return this.API.get(url);
    }
    updateDeliveryStatus(id, params) {
        const url = 'delivery-order/update-manual/' + id;
        return this.API.post(url, params);
    }

    // Sale Quotation
    getListSalesQuotation(params) {
        const url = 'sale-quote';
        return this.API.get(url, params);
    }
    getSaleQuoteDetail(id) {
        const url = ['sale-quote', id].join('/');
        return this.API.get(url);
    }
    getSaleQuoteHistory(id) {
        const url = ['sale-quote/history', id].join('/');
        return this.API.get(url);
    }
    getSalesQuotation() {
        const url = 'order/get-sale-quote-code';
        return this.API.get(url);
    }
    updateSaleQuoteStatus(sale_quote_id, params) {
        const url = 'order/update-sale-quote-status/' + sale_quote_id;
        return this.API.put(url, params);
    }
    sentMailToBuyer(sale_quote_id) {
        const url = 'order/sale-quote/sent-to-buyer/' + sale_quote_id;
        return this.API.get(url);
    }
    getHistoryBySaleQuote(sale_id) {
        const url = 'order/sale-quote/history/' + sale_id;
        return this.API.get(url);
    }
    getListSaleQuotationStatus() {
        const url = 'sale-quote/status';
        return this.API.get(url);
    }

    getListItemById(params) {
        const url = 'product/list-product-to-order';
        return this.API.get(url, params);
    }

    createOrder(params) {
        const url = 'order/create-order';
        return this.API.post(url, params);
    }

    getOrderNumber(id) {
        const url = ['order', 'generate-order-number', id].join('/');
        return this.API.get(url);
    }

    getStatisticalOrder(params) {
        const url = 'order/statistical-order';
        return this.API.get(url, params);
    }

    approveOrd(ordId) {
        const url = 'order/approved/' + ordId;
        return this.API.put(url);
    }

    cancelOrd(ordId) {
        const url = 'order/cancel/' + ordId;
        return this.API.put(url);
    }
    sendEmail(params) {
        const url = 'order/sent-message';
        return this.API.put(url, params);
    }
    generateSO() {
        const url = 'order/get-order-code';
        return this.API.get(url);
    }
    getHistoryByCode(id) {
        const url = 'order/history/' + id;
        return this.API.get(url);
    }
    getInvoice(id) {
        const url = 'order/invoice/' + id;
        return this.API.get(url);
    }
    previewOrder(params) {
        const url = 'order/preview-order';
        return this.API.post(url, params);
    }
    cloneOrder(order_id) {
        const url = 'order/clone-order/' + order_id;
        return this.API.post(url);
    }

    getListItemReference(company_id) {
        const url = 'sale-quote/item/reference/' + company_id;
        return this.API.get(url);
    }

    getListWarehouseOption() {
        const url = 'warehouse/reference';
        return this.API.get(url);
    }

    getAllCustomer() {
        const url = 'buyer/get-all';
        return this.API.get(url);
    }

    getOrderReference() {
        const url = 'order/reference-data';
        return this.API.get(url);
    }
}
