import { TableService } from './../../../../services/table.service';
import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../customer.service';


@Component({
    selector: 'app-customer-site-tab',
    templateUrl: './site-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
})
export class CustomerSiteTabComponent implements OnInit {

    /**
     * letiable Declaration
     */
    @Input() customerId;
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
            'buyer_name': [null],
            'email': [null],
            'buyer_type': [null]
        });

        // Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        // Init Fn
        this.getList();
    }


    /**
     * Internal Function
     */

    getList() {
        const params = Object.assign({}, this.tableService.getParams(), this.searchForm.value);
        Object.keys(params).forEach((key) => (params[key] == null || params[key] === '') && delete params[key]);

        this.customerService.getListSite(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

}
