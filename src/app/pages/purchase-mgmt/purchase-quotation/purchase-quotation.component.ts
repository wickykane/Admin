import { TableService } from './../../../services/table.service';
import { Component, OnInit } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from "../purchase.service";

import { routerTransition } from '../../../router.animations';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


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
    public showProduct: string = '';
    public selectedIndex = 0;
    public list = {
        items: []
    }

    public data = {};

    searchForm: FormGroup;

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastsManager,
        public tableService: TableService, private purchaseService: PurchaseService) {

        this.searchForm = fb.group({
            'cd': [null],
            'supp_id': [null],
            'sts': [null],
            'rqst_dt': [null]
        });

        //Assign get list function name, override variable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        //Init Fn
        this.getList();
        this.getListSupplier();
        this.getListStatus();
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
    getListSupplier() {
        var params = { page: 1, length: 100 }
        this.purchaseService.getListSupplier(params).subscribe(res => {
            try {
                this.listMaster["supplier"] = res.results.rows;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getListStatus() {
        this.purchaseService.getListStatus().subscribe(res => {
            try {
                this.listMaster["status"] = res.results;
            } catch (e) {
                console.log(e);
            }
        });
    }

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
