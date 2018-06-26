import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class PromotionService {

    constructor(private API: ApiService) { }

    /**
     * PROMOTION BUDGET
     */

    getListBudget(params) {
        const url = 'budget/get-list';
        return this.API.get(url, params);
    }

    postBudget(params) {
        const url = 'budget';
        return this.API.post(url, params);
    }
    getListBudgetAll() {
        const url = 'budget/get-list-option';
        return this.API.get(url);
    }
    getBudgetDetail(id) {
        const url = 'budget/' + id;
        return this.API.get(url);
    }
    updateBudget(id, params) {
        const url = 'budget/' + id;
        return this.API.put(url, params);
    }
    approveBudget(id, params) {
        const url = 'budget/' + id + '/approve';
        return this.API.put(url, params);
    }

    /**
     * PROMOTION CAMPAIGN
     */

    getListCampaign(params) {
        const url = 'promotion-campaign/get-list';
        return this.API.get(url, params);
    }
    getListBaseOption() {
        const url = 'promotion-campaign/get-list-based-option';
        return this.API.get(url);
    }
    postCampaign(params) {
        const url = 'promotion-campaign';
        return this.API.post(url, params);
    }
    getListprogramLevel() {
        const url = 'promotion-program-level/get-list';
        return this.API.get(url);
    }
    getTypeProgram() {
        const url = 'promotion-program-type/get-list';
        return this.API.get(url);
    }
    getListPromoType() {
        const url = 'promo-program-detail/get-list-type';
        return this.API.get(url);
    }
    getListRefernceBundle() {
        const url = 'bundle/promo-reference';
        return this.API.get(url);
    }
    getPromoProgram(id) {
        const url = 'promotion-campaign/' + id;
        return this.API.get(url)
    }
    updatePromoProgram(id, params) {
        const url = 'promotion-campaign/' + id;
        return this.API.put(url, params)
    }
    generateCampaignCode() {
        const url = 'promotion-campaign/get-campaign-code';
        return this.API.get(url);
    }

    /**
     * SEGMENT
     */
    getListSegment(params) {
        const url = 'customer_segment';
        return this.API.get(url, params);
    }
    postSegment(params) {
        const url = 'customer_segment';
        return this.API.post(url, params);
    }
    getListAllSegment() {
        const url = 'customer_segment/all';
        return this.API.get(url);
    }
    getCustomerSegment(params) {
        const url = 'customer_segment/search_customer';
        return this.API.get(url, params);
    }
    getDetailSegment(id) {
        const url = 'customer_segment/' + id;
        return this.API.get(url);
    }
    updateSegment(id, params) {
        const url = 'customer_segment/' + id;
        return this.API.put(url, params);
    }
    /**
     * Item Option
     */
    getListItemOption() {
        const url = 'item/reference';
        return this.API.get(url);
    }
    /**
     * CONDITION
     */
    getListCondition(params) {
        const url = 'promotion_condition';
        return this.API.get(url, params);
    }
    getListConditionRef(params?) {
        const url = 'promotion_condition/reference';
        return this.API.get(url, params);
    }
    postCondition(params) {
        const url = 'promotion_condition';
        return this.API.post(url, params);
    }
}