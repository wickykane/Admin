import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class QuickbookService {
    constructor(private $http: Http, private apiService: ApiService) {}

    getSettingInfoQuickbook() {
        const url = 'quick-books/oauth2/settings';
        return this.apiService.get(url);
    }

    sendLoginQuickbookInfo(params) {
        const url = 'quick-books/oauth2/exchange-code-4-token';
        return this.apiService.postForm(url, params);
    }

    uninstallQuickbook(params) {
        const url = 'quick-books/oauth2/revoke';
        return this.apiService.postForm(url, params);
    }
}
