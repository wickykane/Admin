import { TableService } from './../../../services/table.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from "../customer.service";

import { routerTransition } from '../../../router.animations';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.scss'],
  animations: [routerTransition()]
})
export class BuyerComponent implements OnInit {

    /**
     * letiable Declaration
     */
    public listMaster = {};
    public selectedIndex = 0;
    public onoffFilter: any;
    public list = {
        items: []
    };
    public showProduct: boolean = false;
    public flagId: string = '';

    public user: any;
    public listMoreFilter: any = [];

    searchForm: FormGroup;

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastsManager,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        private customerService: CustomerService) {
        this.toastr.setRootViewContainerRef(vRef);

        this.searchForm = fb.group({
            'buyer_name': [null],
            'email': [null],
            'buyer_type': [null]
        });

        //Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        //Init Fn
        this.getList();
        this.listMaster['buyerType'] = [{
            id: 'RS',
            name: 'Repair Shop'
          }, {
            id: 'NU',
            name: 'Normal Customer'
          }];

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
    delete(id) {
        this.customerService.deleteBuyer(id).subscribe( res => {
            try {
                this.toastr.success(res.message);
                this.getList();
            } catch (e) {
                console.log(e);
            }
        })
    }

    getList() {
        let params = Object.assign({}, this.tableService.getParams(), this.searchForm.value);
        Object.keys(params).forEach((key) => (params[key] == null || params[key] == '') && delete params[key]);

        this.customerService.getListBuyer(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

}
