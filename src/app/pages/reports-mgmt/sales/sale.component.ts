import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';

@Component({
    selector: 'app-finance-list',
    templateUrl: './sale.component.html',
    styleUrls: [],
    animations: [routerTransition()],
    providers: [],
})
export class SaleReportComponent implements OnInit {
    constructor() {}
    ngOnInit() {}
}
