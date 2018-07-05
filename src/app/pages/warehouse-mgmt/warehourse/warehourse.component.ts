import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';

@Component({
    selector: 'app-warehourse',
    templateUrl: './warehourse.component.html',
    styleUrls: ['./warehourse.component.scss'],
    animations: [routerTransition()]
})
export class WarehourseComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
