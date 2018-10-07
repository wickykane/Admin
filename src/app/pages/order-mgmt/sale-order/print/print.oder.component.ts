import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-print-order',
    templateUrl: 'print.order.component.html'
})

export class PrintOrderComponent implements OnInit {
    @Input() detail;
    constructor() { }
    ngOnInit() { }
}
