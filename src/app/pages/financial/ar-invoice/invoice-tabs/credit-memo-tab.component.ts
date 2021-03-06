import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinancialService } from '../../financial.service';
import { TableService } from './../../../../services/table.service';

@Component({
    selector: 'app-invoice-credit-memo-tab',
    templateUrl: './credit-memo-tab.component.html',
    styleUrls: ['./invoice-tab.component.scss'],
    providers: [FinancialService]
})
export class InvoiceCreditMemoTabComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public _invoiceId;
    @Input() set invoiceId(id) {
        if (id) {
            this._invoiceId = id;
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
        private financialService: FinancialService
    ) {
        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() { }

    /**
     * Internal Function
     */

    getList() {
        this.financialService.getListCreditMemo( this._invoiceId).subscribe(res => {
            try {
                this.list.items =  res.data.rows;
            } catch (e) {
                console.log(e);
            }
        });
    }

}
