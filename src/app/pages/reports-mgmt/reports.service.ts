import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class ReportsService {

    constructor(private API: ApiService) { }

    getCustomerOutstandingMasterData() {
        const url = 'customer-report/get-reference';
        return this.API.get(url);
    }

    getCustomerOutstandingReport(params) {
        const url = 'customer-report/list';
        return this.API.get(url, params);
    }

    sendMailCustomerOutstanding(params) {
        const url = '';
        return this.API.post(url, params);
    }

    exportExcelCustomerOutstanding(params) {
        const url = '';
        return this.API.get(url, params);
    }

    exportPDFCustomerOutstanding(params) {
        const url = '';
        return this.API.get(url, params);
    }
}
