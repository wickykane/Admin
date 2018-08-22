import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';
import { TableService } from './../../../../services/table.service';


@Component({
    selector: 'app-quote-history-tab',
    templateUrl: './quote-history.component.html',
    styleUrls: ['./quote-history.scss'],
    providers: [OrderService]
})
export class QuoteHistoryTabComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public _saleQuoteId;
    @Input() set saleQuoteId(id) {
        if (id) {
            this._saleQuoteId = id;
            console.log(this._saleQuoteId );
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
        private orderService: OrderService
    ) {
        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        this.listMaster['timeline'] = [];
    }

    /**
     * Internal Function
     */

    getList() {
        const params = {...this.tableService.getParams()};
        Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

        this.orderService.getSaleQuoteHistory(this._saleQuoteId).subscribe(res => {
            try {
                this.listMaster['timeline'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

}
