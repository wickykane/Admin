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
    public detail = {
        'billing_address': {},
        'shipping_address': {},
        'items': [],
        'buyer_info': {},
        'sales_order': {}
    };
    data = {};
    public totalQTY = 0;
    public totalInvoiceQTY = 0;

    constructor(
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        private financialService: FinancialService) {
    }

    ngOnInit() {
        this.getDetailInvoice();

    }

    /**
     * Internal Function
     */

    getDetailInvoice() {
        this.financialService.getDetailInvoice(this._invoiceId).subscribe(res => {
            try {
                this.detail = res.data;
                this.detail['billing_address'] = res.data.address.billing[0];
                this.detail['shipping_address'] = res.data.address.shipping[0];
                this.detail['sales_order'] = res.data.orders[0];
                this.detail['items'] = res.data.items;
                this.detail['items'].forEach((item) => {
                    this.totalQTY += item.order_detail_total_qty;
                    this.totalInvoiceQTY += item.invoice_qty;
                });
                this.detail['buyer_info'] = res.data.address.list[0];
            } catch (e) {
                console.log(e);
            }
        });
    }

}
