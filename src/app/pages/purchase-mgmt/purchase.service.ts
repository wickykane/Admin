import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class PurchaseService {

    constructor(private API: ApiService) { }

    /**
     * PURCHASE QUOTATION
     */
    //Quotation
    getListPurchaseQuotation(params) {
        var url = 'purchase_quote';
        return this.API.get(url, params);
    }
    createPurchaseQuotation(params) {
        var url = 'purchase_quote';
        return this.API.post(url, params);
    }
    getDetailPurchaseQuotation(id) {
        var url = 'purchase_quote/' + id;
        return this.API.get(url);
    }
    upddatePurchaseQuotation(params, id) {
        var url = 'purchase_quote/' + id;
        return this.API.put(url, params);
    }
    getListSupplier(params) {
        var url = 'company/list-option-company?is_supplier=true';
        return this.API.get(url, params);
    }
    getListStatus() {
        var url = 'purchase_quote_status';
        return this.API.get(url);
    }
    sentToSuppPQ(id) {
        var url = 'purchase_quote/sent_to_supp/' + id;
        return this.API.put(url);
    }
    aprvByMgrPQ(id) {
        var url = 'purchase_quote/aprv_by_mgr/' + id;
        return this.API.put(url);
    }
    rjtByMgrPQ(id) {
        var url = 'purchase_quote/rjt_by_mgr/' + id;
        return this.API.put(url);
    }
    generateCodePurchaseQuotation() {
        var url = 'purchase_quote/generate_code';
        return this.API.get(url);
    }
    /**
     * PURCHASE Order
     */
    //Order
    getListPurchaseOrder(params) {
        var url = 'oli_purchase_order';
        return this.API.get(url, params);
    }
    createPurchaseOrder(params) {
        var url = 'oli_purchase_order';
        return this.API.post(url, params);
    }
    getDetailPurchaseOrder(id) {
        var url = 'oli_purchase_order/' + id;
        return this.API.get(url);
    }
    getListStatusOrder() {
        var url = 'oli_purchase_order/status';
        return this.API.get(url);
    }
    getPOCode() {
        var url = 'oli_purchase_order/generate_code';
        return this.API.get(url);
    }
    getListQuoteApproved(params) {
        var url = 'purchase_quote';
        return this.API.get(url, params);
    }
    getListIncoterm() {
        var url = 'incoterm';
        return this.API.get(url);
    }
    getListCompanySetup() {
        var url = ['company-master', 'index'].join('/');
        return this.API.get(url);
    }
    getListWarehouse() {
        var url = 'warehouse/index';
        return this.API.get(url);
    }
    sendMailPO(params, id) {
        var url = 'sale-price';
        return this.API.post(url, params);
    }
    /**
     * INBOUND DELIVERY
     */
    //Inbound
    getListInboundDelievery(params) {
        var url = 'purchase_order_delivery';
        return this.API.get(url, params);
    }
    /**
     * WAREHOUSE RECEIPT
     */
    //Warehouse
    getListWarehouseReceipt(params) {
        var url = 'warehouse_receipt';
        return this.API.get(url, params);
    }
    createWarehouseReceipt(params) {
        var url = 'warehouse_receipt';
        return this.API.post(url, params);
    }
    updateStatusWarehouseReceiptCode(params, id) {
        var url = 'warehouse_receipt/status/' + id;
        return this.API.put(url, params);
    }
    getPurchaseOrderDelivery() {
        var url = 'purchase_order_delivery?is_all=1&sts=2';
        return this.API.get(url);
    }
    generationWarehouseReceiptCode() {
        var url = 'warehouse_receipt/generate_code';
        return this.API.get(url);
    }
    getDetailDeliveryOrder(id) {
        var url = 'purchase_order_delivery/' + id;
        return this.API.get(url);
    }


}
