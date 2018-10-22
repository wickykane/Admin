import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../../router.animations';

// Services
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { TableService } from '../../../services/index';
import { WarehouseListKeyService } from './lit-keys.control';
import { WarehouseService } from './warehouse.service';

import { cdArrowTable } from '../../../shared';
@Component({
    selector: 'app-warehouse',
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.scss'],
    providers: [WarehouseService, WarehouseListKeyService],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarehouseComponent implements OnInit {

    @ViewChild(cdArrowTable) table: cdArrowTable;

    public list = {
        items: []
    };
    public user: any;
    public flagAddress: boolean;
    public listMaster = {};
    public selectedIndex = 0;

    constructor(
        private router: Router,
        private cd: ChangeDetectorRef,
        public tableService: TableService,
        public toastr: ToastrService,
        private _hotkeysService: HotkeysService,
        public keyService: WarehouseListKeyService,
        private warehouseService: WarehouseService
    ) {
        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
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

    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td a').focus();
    }
}
