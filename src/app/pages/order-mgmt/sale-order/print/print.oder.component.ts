import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'print-order',
    templateUrl: 'print.order.component.html'
})

export class PrintOrderComponent implements OnInit {
    @Input() detail;
    constructor() { }
    ngOnInit() { }
}