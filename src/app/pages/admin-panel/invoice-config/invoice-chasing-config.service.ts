import { Injectable } from "@angular/core";
import { ApiService } from "../../../services/api.service";

@Injectable()
export class InvoiceConfigService {
    constructor(private apiService: ApiService) {}

    getInvoiceConfigInfo() {
        const url = "config/invoicechase/";
        return this.apiService.get(url);
    }

    getEmailTemplate(key) {
        const url = "config/invoicechase/getbykey/" + key;
        return this.apiService.get(url);
    }

    saveInvoiceConfigInfo(params) {
        const url = "config/invoicechase/update";
        return this.apiService.put(url,params);
    }

    saveEmailTemplate(id, params) {
        const url = "config/invoicechase/update/" + id;
        return this.apiService.put(url,params);
    }
}
