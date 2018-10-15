import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../customer.service';

import { TableService } from '../../../../services/table.service';


@Component({
    selector: 'app-customer-customer-balance-tab',
    templateUrl: './customer-balance-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerCustomerBalanceTabComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public _customerId;
    public listReference: any;
    @Input() set customerId(id) {
        if (id) {
            this._customerId = id;
            // this.getList();
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
        private customerService: CustomerService, private cd: ChangeDetectorRef) {

        this.searchForm = fb.group({
            'code': [null],
            'cus_po': [null],
            'sale_quote_num': [null],
            'type': [null],
            'sts': [null],
            'buyer_name': [null],
            'date_type': [null],
            'date_to': [null],
            'date_from': [null],
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        // this.getListReference();
    }

    ngOnInit() {

    }

    /**
     * Internal Function
     */

     refresh() {
         this.cd.detectChanges();
     }

     getListReference() {
        this.customerService.getListCustomerBalanceReference().subscribe(res => {
            try {
                console.log(res);
                // this.listReference = res.data;
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
     }
    getList() {
        const params = {...this.tableService.getParams(), ...this.searchForm.value};
        Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

        this.customerService.getListInvoice(this._customerId, params).subscribe(res => {
            try {
                this.list.items = [] || res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

}
