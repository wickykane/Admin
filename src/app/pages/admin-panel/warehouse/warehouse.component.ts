import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';

// Services
import { ToastrService } from 'ngx-toastr';
import { TableService } from '../../../services/index';
import { WarehouseService } from './warehouse.service';

@Component({
    selector: 'app-warehouse',
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.scss'],
    providers: [WarehouseService],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarehouseComponent implements OnInit {
    public list = {
        items: []
    };
    public user: any;
    public flagAddress: boolean;
    public listMaster = {};
    public selectedIndex = 0;

    constructor(
        private cd: ChangeDetectorRef,
        public tableService: TableService,
        public toastr: ToastrService,
        private warehouseService: WarehouseService
    ) {
        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    selectData(index) {
        console.log(index);
    }

    ngOnInit() {
        this.getList();
        this.user = JSON.parse(localStorage.getItem('currentUser'));
    }

    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    changeStatus(id, status) {
        this.warehouseService.changeStatus(id, status).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.refresh();
                this.getList();
            } catch (e) {

            }
        });
    }

    setShipping(id) {
        this.warehouseService.setShipping(id).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.refresh();
                this.getList();
            } catch (e) {

            }
        });
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
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }
}
