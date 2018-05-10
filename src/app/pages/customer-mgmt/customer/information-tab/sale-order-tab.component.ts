import { TableService } from './../../../../services/table.service';
import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../customer.service';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';


@Component({
    selector: 'app-customer-sale-order-tab',
    templateUrl: './sale-order-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
    providers: [OrderService]
})
export class CustomerSaleOrderTabComponent implements OnInit {

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
        private customerService: CustomerService,
        private orderService: OrderService) {

        this.searchForm = fb.group({
            'buyer_name': [null],
            'code': [null],
            'purchase_order_cd': [null],
            'order_sts_id': [null],
            'order_date_from': [null],
            'order_date_to': [null]
        });

        // Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        this.getListStatus();
    }

    /**
     * Internal Function
     */
    getListStatus() {
        this.orderService.getListStatus().subscribe(res => {
            this.listMaster['status'] = res.results;
        });
    }

    getList() {
        const params = Object.assign({}, this.searchForm.value);
        Object.keys(params).forEach((key) => (params[key] == null || params[key] === '') && delete params[key]);

        this.customerService.getListSO(this._customerId, params).subscribe(res => {
            try {
                this.list.items = res.data || [];
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

}
