import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { routerTransition } from '../../../router.animations';
import { Router } from '@angular/router';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { PurchaseService } from "../purchase.service";
import { TableService } from './../../../services/table.service';

@Component({
    selector: 'app-quotation',
    templateUrl: './purchase-quotation.component.html',
    styleUrls: ['./purchase-quotation.component.scss'],
    animations: [routerTransition()]
})
export class QuotationComponent implements OnInit {
    /**
     * Variable Declaration
     */
    public listMaster = {};
    public selectedIndex = 0;
    public list = {
        items: []
    }

    public data = {};

    searchForm: FormGroup;

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastsManager, vcr: ViewContainerRef,
        public tableService: TableService, private purchaseService: PurchaseService) {

        this.searchForm = fb.group({
            'cd': [null],
            'supp_id': [null],
            'sts': [null],
            'rqst_dt': [null]
        });

        this.toastr.setRootViewContainerRef(vcr);
        //Assign get list function name, override variable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        //Init Fn
        this.getList();
    }
    /**
     * Table Event
     */
    selectData(index) {
      console.log(index);
    }
    /**
     * Internal Function
     */
    getList() {
        var params = Object.assign({}, this.tableService.getParams(), this.searchForm.value);
        Object.keys(params).forEach((key) => (params[key] == null || params[key] == '') && delete params[key]);

        this.purchaseService.getListPurchaseQuotation(params).subscribe(res => {
            try {
                this.list.items = res.results.rows;
                this.tableService.matchPagingOption(res.results);
            } catch (e) {
                console.log(e);
            }
        });
    }

}
