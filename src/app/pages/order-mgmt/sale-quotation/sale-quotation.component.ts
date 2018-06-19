import { TableService } from './../../../services/table.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../order-mgmt.service';

import { routerTransition } from '../../../router.animations';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


@Component({
    selector: 'app-sale-quotation',
    templateUrl: './sale-quotation.component.html',
    styleUrls: ['./sale-quotation.component.scss'],
    animations: [routerTransition()]
})
export class SaleQuotationComponent implements OnInit {
    /**
     * letiable Declaration
     */
    public listMaster = {};
    public selectedIndex = 0;
    public list = {
        items: []
    };
    public user: any;
    public onoffFilter: any;

    searchForm: FormGroup;

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastsManager,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        private orderService: OrderService) {
        this.toastr.setRootViewContainerRef(vRef);

        this.searchForm = fb.group({
            'sale_quote_num': [null],
            'buyer_name': [null],
            'sts_code': [null],
            'date_type': [null],
            'date_from': [null],
            'date_to': [null]
        });

        // Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        // Init Fn
        this.listMaster['listFilter'] = [{ value: false, name: 'Date Filter' }];
        this.listMaster['dateType'] = [{ id: 1, name: 'Quote Date' }, { id: 2, name: 'Expiry Date' }, { id: 3, name: 'Exp Delivery Date' }];
        this.getList();
        this.getListStatus();
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
    getListStatus() {
        this.orderService.getListSaleQuotationStatus().subscribe(res => {
            try {
              this.listMaster['listStatus'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

    sentMailToBuyer(id) {
        this.orderService.sentMailToBuyer(id).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });
    }

    approveByManager(id) {
        const params = { status: 'AM' };
        this.orderService.updateSaleQuoteStatus(id, params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });

    }

    getList() {

        const params = Object.assign({}, this.tableService.getParams(), this.searchForm.value);
        Object.keys(params).forEach((key) => (params[key] == null || params[key] === '') && delete params[key]);

        this.orderService.getListSalesQuotation(params).subscribe(res => {
            try {
                this.list.items = res.results.rows;
                this.tableService.matchPagingOption(res.results);
            } catch (e) {
                console.log(e);
            }
        });
    }

}
