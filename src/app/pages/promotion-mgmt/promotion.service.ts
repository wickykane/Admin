import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class PromotionService {

    constructor(private API: ApiService) { }

    /**
     * PROMOTION BUDGET
     */
    //Budget
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
}