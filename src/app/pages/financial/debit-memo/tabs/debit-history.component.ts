import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableService } from './../../../../services/table.service';
import { DebitMemoService } from './../debit-memo.service';

@Component({
    selector: 'app-debit-history-tab',
    templateUrl: './debit-history.component.html',
    styleUrls: ['./debit-history.component.scss'],
    providers: [DebitMemoService]
})
export class DebitHistoryTabComponent implements OnInit {

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
        private debitService: DebitMemoService
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

        this.debitService.getDebitHistory(this._orderId).subscribe(res => {
            try {
                this.listMaster['timeline'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

}
