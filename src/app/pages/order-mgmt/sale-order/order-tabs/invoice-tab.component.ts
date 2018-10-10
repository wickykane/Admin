import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';
import { TableService } from './../../../../services/table.service';

import { FinancialService } from '../../../financial/financial.service';

@Component({
    selector: 'app-order-invoice-tab',
    templateUrl: './invoice-tab.component.html',
    styleUrls: ['./order-tab.component.scss'],
    providers: [OrderService, FinancialService]
})
export class SaleOrderInvoiceTabComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public _orderId;
    @Input() set orderId(id) {
        if (id) {
            this._orderId = id;
            this.getList();
        }
    }

    public listMaster = {};

    public list = {
        items: []
    };

    searchForm: FormGroup;

    constructor(
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        private orderService: OrderService,
        private financialService: FinancialService
      ) {
        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        this.getListStatus();
    }

    /**
     * Internal Function
     */

    getList() {
        const params = {...this.tableService.getParams()};
        Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

        this.orderService.getInvoice( this._orderId).subscribe(res => {
            try {
                this.list.items = res.data;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }
    convertStatus(id, key) {
        const stt = (this.listMaster[key] || []).find(item => item.id === id) || {};
        return stt.name;
    }
    getListStatus() {
        this.financialService.getInvoiceStatus().subscribe(res => {
            this.listMaster['status'] = res.data.status;
            // this.refresh();
        });
    }
}
