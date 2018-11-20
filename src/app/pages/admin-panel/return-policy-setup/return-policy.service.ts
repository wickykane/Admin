import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class ReturnPolicyService {
    constructor(private $http: Http, private apiService: ApiService) {}

    getReturnPolicy() {
        const url = 'return-policy/get-return-policy';
        return this.apiService.get(url);
    }

    saveReturnPolicy(params) {
        const url = 'return-policy/save-return-policy';
        return this.apiService.postForm(url, params);
    }

}
