import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReceiptVoucherService } from '../receipt-voucher.service';
import { TableService } from './../../../../services/table.service';

@Component({
    selector: 'app-receipt-document-tab',
    templateUrl: './document-tab.component.html',
    styleUrls: ['./receipt-tab.component.scss'],
    providers: [ReceiptVoucherService]
})
export class ReceiptDocumentTabComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public _receiptId;
    @Input() set receiptId(id) {
        if (id) {
            this._receiptId = id;
        }
    }
    public detail = {
        history: []
    };

    constructor(
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        private receiptVoucherService: ReceiptVoucherService) {
    }

    ngOnInit() {

    }

}
