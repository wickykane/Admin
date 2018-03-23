import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class PromotionService {

    constructor(private API: ApiService) { }

    /**
     * PROMOTION BUDGET
     */

    getListBudget(params) {
        var url = 'budget/get-list';
        return this.API.get(url, params);
    }

    postBudget(params) {
        var url = 'budget';
        return this.API.post(url, params);
    }
    getListBudgetAll() {
        var url = 'budget/get-list-option';
        return this.API.get(url);
    }
    getBudgetDetail(id) {
        var url = 'budget/' + id;
        return this.API.get(url);
    }
    updateBudget(id, params) {
        var url = 'budget/' + id;
        return this.API.put(url, params);
    }
    approveBudget(id, params) {
        var url = 'budget/' + id + '/approve';
        return this.API.put(url, params);
    }

    /**
     * PROMOTION CAMPAIGN
     */

    getListCampaign(params) {
        var url = 'promotion-campaign/get-list';
        return this.API.get(url, params);
    }
    getListBaseOption() {
        var url = 'promotion-campaign/get-list-based-option';
        return this.API.get(url);
    }
    postCampaign(params) {
        var url = 'promotion-campaign';
        return this.API.post(url, params);
    }
    getListprogramLevel() {
        var url = 'promotion-program-level/get-list';
        return this.API.get(url);
    }
    getTypeProgram() {
        var url = 'promotion-program-type/get-list';
        return this.API.get(url);
    }
    getListPromoType() {
        var url = 'promo-program-detail/get-list-type';
        return this.API.get(url);
    }
    getListRefernceBundle() {
        var url = 'bundle/promo-reference';
        return this.API.get(url);
    }
    getPromoProgram(id) {
        var url = "promotion-campaign/" + id;
        return this.API.get(url)
    }
    updatePromoProgram(id, params) {
        var url = "promotion-campaign/" + id;
        return this.API.put(url, params)
    }
    generateCampaignCode() {
        var url = 'promotion-campaign/get-campaign-code';
        return this.API.get(url);
    }

    /**
     * SEGMENT
     */
    getListSegment(params) {
        var url = 'customer_segment';
        return this.API.get(url, params);
    }
    postSegment(params) {
        var url = 'customer_segment';
        return this.API.post(url, params);
    }
    getListAllSegment() {
        var url = 'customer_segment/all';
        return this.API.get(url);
    }
    getCustomerSegment(params) {
        var url = 'customer_segment/search_customer';
        return this.API.get(url, params);
    }
    getDetailSegment(id) {
        var url = 'customer_segment/' + id;
        return this.API.get(url);
    }
    updateSegment(id, params) {
        var url = 'customer_segment/' + id;
        return this.API.put(url, params);
    }
}