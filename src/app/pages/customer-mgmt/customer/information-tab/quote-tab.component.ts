import { TableService } from './../../../../services/table.service';
import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../customer.service';


@Component({
    selector: 'app-customer-quote-tab',
    templateUrl: './quote-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
})
export class CustomerQuoteTabComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public _customerId;
    @Input() set customerId(id) {
        if (id) {
            this._customerId = id;
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
        private customerService: CustomerService) {

        this.searchForm = fb.group({
            'code': [null],
            'company_name': [null],
            'qt_dt_from': [null],
            'qt_dt_to': [null],
        });

        // Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() { }

    /**
     * Internal Function
     */

    getList() {
        const params = Object.assign({}, this.searchForm.value);
        Object.keys(params).forEach((key) => (params[key] == null || params[key] === '') && delete params[key]);

        this.customerService.getListQuote(this._customerId, params).subscribe(res => {
            try {
                this.list.items = res.data;
                // this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

}
