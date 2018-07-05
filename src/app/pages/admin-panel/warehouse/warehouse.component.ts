import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';

// Services
import { TableService } from '../../../services/index';
import { WarehouseService } from './warehouse.service';

@Component({
    selector: 'app-warehouse',
    templateUrl: './warehouse.component.html',
    providers: [WarehouseService],
    styleUrls: ['./warehouse.component.scss'],
    animations: [routerTransition()]
})
export class WarehouseComponent implements OnInit {
    public list = {
        items: []
    };
    public user: any;

    constructor(
        public tableService: TableService,
        private warehouseService: WarehouseService
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

        this.warehouseService.getListWarehouse(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }
}
