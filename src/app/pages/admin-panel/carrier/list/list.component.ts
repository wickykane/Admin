import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { TableService } from '../../../../services/table.service';
import { CarrierService } from '../carrier.service';
import {CarrierKeyService} from './keys.control';

@Component({
    selector: 'app-carrier-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    providers: [CarrierKeyService],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
    public list = {
        items: []
    };
    public user: any;
    public listMaster = {};
    searchForm: FormGroup;

    constructor(public router: Router,
        private cd: ChangeDetectorRef,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        public keyService: CarrierKeyService,
        private cs: CarrierService) {

        this.searchForm = fb.group({
            'name': [null],
            'email': [null]
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        this.getList();
        this.user = JSON.parse(localStorage.getItem('currentUser'));
    }

    refresh() {
        this.cd.detectChanges();
    }

    getList() {
        const params = {...this.tableService.getParams(), ...this.searchForm.value};
        Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

        this.cs.getListCarrier(params).subscribe(res => {
            this.list.items = res.data.rows;
            this.tableService.matchPagingOption(res.data);
            this.refresh();
        });
    }

}
