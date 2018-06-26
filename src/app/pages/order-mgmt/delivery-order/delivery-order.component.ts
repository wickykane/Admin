import { TableService } from './../../../services/table.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { OrderService } from '../order-mgmt.service';

import { routerTransition } from '../../../router.animations';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-delivery-order',
    templateUrl: './delivery-order.component.html',
    styleUrls: ['./delivery-order.component.scss'],
    animations: [routerTransition()]
})
export class DeliveryOrderComponent implements OnInit {

    /**
     * Variable Declaration
     */
    public listMaster = {};
    public selectedIndex = 0;

    public list = {
        items: []
    };

    public user: any;

    searchForm: FormGroup;

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        public tableService: TableService, private orderService: OrderService) {
         

        this.searchForm = fb.group({
            'code': [null],
            'order_code': [null],
            'buyer_name': [null],
            'status_id': [null]
        });

        // Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        // Init Fn
        this.listMaster['status'] = [{
            id: '1',
            name: 'NEW'
        }, {
            id: '2',
            name: 'READY TO SHIP'
        },
        {
            id: '3',
            name: 'IN TRANSIT'
        }, {
            id: '4',
            name: 'DELIVERED'
        }];
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
    updateStatus(id) {
        this.orderService.updateStatus(id).subscribe(res => {
            try {

            } catch (e) {
                console.log(e);
            }
        });
    }

    editDeliveryOrder(id) {
        this.router.navigate(['order-management/delivery-order/detail/' + id ]);
    }

    getList() {
        let params = Object.assign({}, this.tableService.getParams(), this.searchForm.value);
        Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

        this.orderService.getListDeliveryOrder(params).subscribe(res => {
            try {
                this.list.items = res.results.rows;
                this.tableService.matchPagingOption(res.results);
            } catch (e) {
                console.log(e);
            }
        });
    }

}
