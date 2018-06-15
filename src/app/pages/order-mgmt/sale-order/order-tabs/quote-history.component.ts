import { TableService } from './../../../../services/table.service';
import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';


@Component({
    selector: 'app-sale-quote-history-tab',
    templateUrl: './quote-history.component.html',
    styleUrls: ['./quote-history.scss'],
    providers: [OrderService]
})
export class SaleQuoteHistoryTabComponent implements OnInit {

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
        private orderService: OrderService
    ) {
        // Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        this.listMaster['timeline'] = [
            {
                'log_date': '14-06-2018',
                'log_data': [
                    {
                        'log_user_name': 'admin system',
                        'log_date': '2018-06-14 09:51:07',
                        'log_content': 'Sale Quotation #SQ-1806-00125 created by admin system.'
                    },
                    {
                        'log_user_name': 'admin system',
                        'log_date': '2018-06-14 09:51:13',
                        'log_content': 'Sale Quotation #SQ-1806-00125 approved by admin system.'
                    },
                    {
                        'log_user_name': 'admin system',
                        'log_date': '2018-06-14 09:51:33',
                        'log_content': 'Sale Quotation #SQ-1806-00125 sent to admin system.'
                    },
                    {
                        'log_user_name': '',
                        'log_date': '2018-06-14 09:53:12',
                        'log_content': 'Sale Quotation #SQ-1806-00125 rejected by buyer.'
                    }
                ]
            },
            {
                'log_date': '15-06-2018',
                'log_data': [
                    {
                        'log_user_name': 'admin system',
                        'log_date': '2018-06-15 09:51:07',
                        'log_content': 'Sale Quotation #SQ-1806-00125 created by admin system.'
                    },
                    {
                        'log_user_name': 'admin system',
                        'log_date': '2018-06-15 09:51:13',
                        'log_content': 'Sale Quotation #SQ-1806-00125 approved by admin system.'
                    },
                    {
                        'log_user_name': 'admin system',
                        'log_date': '2018-06-15 09:51:33',
                        'log_content': 'Sale Quotation #SQ-1806-00125 sent to admin system.'
                    },
                    {
                        'log_user_name': 'sfas',
                        'log_date': '2018-06-15 09:53:12',
                        'log_content': 'Sale Quotation #SQ-1806-00125 rejected by buyer.'
                    }
                ]
            }
        ];
    }

    /**
     * Internal Function
     */

    getList() {
        const params = Object.assign({}, this.tableService.getParams());
        Object.keys(params).forEach((key) => (params[key] == null || params[key] === '') && delete params[key]);

        this.orderService.getInvoice(this._orderId).subscribe(res => {
            try {
                this.list.items = [] || res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

}
