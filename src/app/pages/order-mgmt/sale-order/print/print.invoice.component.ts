import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-print-invoice',
    templateUrl: 'print.invoice.component.html'
})

export class PrintInvoiceComponent implements OnInit {
    @Input() detail;
    constructor() { }
    ngOnInit() { }
}
