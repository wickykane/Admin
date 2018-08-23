import { Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../services/table.service';
import { SaleQuoteKeyService } from './keys.list.control';

import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { OrderService } from '../order-mgmt.service';


@Component({
    selector: 'app-sale-quotation',
    templateUrl: './sale-quotation.component.html',
    styleUrls: ['./sale-quotation.component.scss'],
    providers: [SaleQuoteKeyService],
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
        public toastr: ToastrService,
        public tableService: TableService,
        private orderService: OrderService,
        private _hotkeysService: HotkeysService,
        public saleQuoteKeyService: SaleQuoteKeyService,
        private renderer: Renderer) {

        this.searchForm = fb.group({
            'quote_no': [null],
            'buyer_name': [null],
            'sts': [null],
            'date_type': [null],
            'date_from': [null],
            'date_to': [null]
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        //  Init Key
        this.saleQuoteKeyService.watchContext.next({ context: this, service: this._hotkeysService });

    }

    ngOnInit() {
        //  Init Fn
        this.listMaster['listFilter'] = [{ value: false, name: 'Date Filter' }];
        this.listMaster['dateType'] = [{ id: 'quote_date', name: 'Quote Date' }, { id: 'expiry_dt', name: 'Expiry Date' }, { id: 'delivery_dt', name: 'Delivery Date' }];
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

    moreFilter() {
        this.onoffFilter = !this.onoffFilter;
    }


    getList() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };

        Object.keys(params).forEach((key) => {
            if (params[key] instanceof Array) {
                params[key] = params[key].join(',');
            }
            // tslint:disable-next-line:no-unused-expression
            (params[key] === null || params[key] === '') && delete params[key];
        });
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

        this.orderService.getListSalesQuotation(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

    updateStatus(id, status) {
        const params = { status };
        this.orderService.updateSaleQuoteStatus(id, params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });
    }

    cloneQuote(id) {
        this.orderService.cloneQuote(id).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });
    }
}
