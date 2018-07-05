import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';

// Services
import { TableService } from '../../../services/index';
import { WarehourseService } from './warehourse.service';

@Component({
    selector: 'app-warehourse',
    templateUrl: './warehourse.component.html',
    styleUrls: ['./warehourse.component.scss'],
    animations: [routerTransition()]
})
export class WarehourseComponent implements OnInit {
    public list = {
        items: []
    };
    public user: any;

    constructor(
        public tableService: TableService,
        private warehourseService: WarehourseService
    ) {
        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        this.getList();
        this.user = JSON.parse(localStorage.getItem('currentUser'));
    }

    getList() {
        const params = {
            ...this.tableService.getParams()
        };
        Object.keys(params).forEach(
            key =>
                (params[key] === null || params[key] === '') &&
                delete params[key]
        );

        this.warehourseService.getListWarehouse(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }
}
