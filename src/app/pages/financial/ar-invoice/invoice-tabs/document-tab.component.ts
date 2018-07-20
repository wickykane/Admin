import { TableService } from './../../../../services/table.service';
import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FinancialService } from '../../financial.service';

@Component({
    selector: 'app-invoice-document-tab',
    templateUrl: './document-tab.component.html',
    styleUrls: ['./invoice-tab.component.scss'],
    providers: [FinancialService]
})
export class InvoiceDocumentTabComponent implements OnInit {

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
        history: []
    };

    constructor(
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        private financialService: FinancialService) {
    }

    ngOnInit() {

    }

}
