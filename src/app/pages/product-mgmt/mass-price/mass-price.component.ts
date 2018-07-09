import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product-mgmt.service';
import { TableService } from './../../../services/table.service';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';

@Component({
    selector: 'app-mass-price',
    templateUrl: './mass-price.component.html',
    styleUrls: ['./mass-price.component.scss'],
    animations: [routerTransition()]
})
export class MassPriceComponent implements OnInit {

    /**
     * letiable Declaration
     */
    public selectedIndex = 0;
    public list = {
        items: []
    };

    searchForm: FormGroup;

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        private productService: ProductService) {

        this.searchForm = fb.group({
            'date_from': [null],
            'date_to': [null]
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        //  Init Fn
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

        const params = { ...this.tableService.getParams(), ...this.searchForm.value };
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

        this.productService.getListMassPrice(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

}
