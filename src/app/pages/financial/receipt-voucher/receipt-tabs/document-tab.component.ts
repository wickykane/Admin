import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinancialService } from '../../financial.service';
import { TableService } from './../../../../services/table.service';

@Component({
    selector: 'app-receipt-document-tab',
    templateUrl: './document-tab.component.html',
    styleUrls: ['./receipt-tab.component.scss'],
    providers: [FinancialService]
})
export class ReceiptDocumentTabComponent implements OnInit {

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
