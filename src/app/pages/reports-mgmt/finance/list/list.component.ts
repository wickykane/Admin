import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';

@Component({
    selector: 'app-finance-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    animations: [routerTransition()],
    providers: [],
})
export class ReportFinanceListComponent implements OnInit {
    public hover: any;
    public questionClick: any;
    constructor() {}

    ngOnInit() {}
    onHover() {
        this.questionClick = false;
        this.hover = true;
    }
    outHover() {
        this.questionClick = false;
        this.hover = false;
    }
    questClick() {
        this.questionClick = true;
        this.hover = false;
    }
}
