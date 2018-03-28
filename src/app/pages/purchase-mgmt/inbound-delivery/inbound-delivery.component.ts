import { TableService } from './../../../services/table.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from "../purchase.service";

import { routerTransition } from '../../../router.animations';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-inbound-delivery',
  templateUrl: './inbound-delivery.component.html',
  styleUrls: ['./inbound-delivery.component.scss'],
  animations: [routerTransition()]
})
export class InboundDeliveryComponent implements OnInit {

    /**
     * letiable Declaration
     */
    public listMaster = {};
    public selectedIndex = 0;
    public list = {
        items: []
    };
    public showProduct: boolean = false;
    public flagId: string = '';

    public user: any;

    searchForm: FormGroup;

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastsManager,
        private vRef: ViewContainerRef,
        public tableService: TableService, private purchaseService: PurchaseService) {
        this.toastr.setRootViewContainerRef(vRef);

        this.searchForm = fb.group({
            'cd': [null],
            'name': [null]
        });

        //Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        //Init Fn
        this.getList();

        this.user = JSON.parse(localStorage.getItem('currentUser'));
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
     toggleSubRow(id) {
         if (id === this.flagId) {
             this.flagId = '0';
         } else {
             this.flagId = id;
         }
         this.showProduct = !this.showProduct;
     }

    getList() {

        let params = Object.assign({}, this.tableService.getParams(), this.searchForm.value);
        Object.keys(params).forEach((key) => (params[key] == null || params[key] == '') && delete params[key]);

        this.purchaseService.getListInboundDelievery(params).subscribe(res => {
            try {
                this.list.items = res.results.rows;
                this.tableService.matchPagingOption(res.results);
            } catch (e) {
                console.log(e);
            }
        });
    }

}
