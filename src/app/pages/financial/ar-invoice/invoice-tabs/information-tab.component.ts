import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinancialService } from '../../financial.service';
import { TableService } from './../../../../services/table.service';

@Component({
    selector: 'app-invoice-info-tab',
    templateUrl: './information-tab.component.html',
    styleUrls: ['./invoice-tab.component.scss'],
    providers: [FinancialService]
})
export class InvoiceInformationTabComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public _invoiceId;
    @Input() set invoiceId(id) {
        if (id) {
            this._invoiceId = id;
        }
    }
    public totalQTY;
    public totalInvoiceQTY;
    public detail;
    @Input() set orderDetail(detail) {
        if (detail) {
            this.detail = detail;
            this.totalQTY = 0;
            this.totalInvoiceQTY = 0;
            this.calculateQTY();
        }
    }
    data = {};
    constructor(
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        private financialService: FinancialService) {
    }

    ngOnInit() { }

    /**
     * Internal Function
     */

    calculateQTY() {
        this.detail['items'].forEach((item) => {
            this.totalQTY += item.order_detail_total_qty;
            this.totalInvoiceQTY += item.invoice_qty;
        });
    }

}
