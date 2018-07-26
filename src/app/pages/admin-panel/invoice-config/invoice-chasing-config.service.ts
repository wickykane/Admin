import { Injectable } from "@angular/core";
import { ApiService } from "../../../services/api.service";

@Injectable()
export class InvoiceConfigService {
    constructor(private apiService: ApiService) {}

    getInvoiceConfigInfo() {
        const url = "config/invoicechase/";
        return this.apiService.get(url);
    }
}
