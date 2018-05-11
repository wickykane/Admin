import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../customer.service';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { CustomerKeyService } from './keys.control';
import { TableService } from './../../../services/table.service';

@Component({
    selector: 'app-customer-view',
    templateUrl: './customer-view.component.html',
    styleUrls: ['./customer.component.scss'],
    animations: [routerTransition()],
    providers: [CustomerKeyService]
})

export class CustomerViewComponent implements OnInit {

    public customer = {};
    public customerId;
    public listMaster = {};

    @ViewChild('tabSet') tabSet;

    constructor(
        public router: Router,
        public tableService: TableService,
        public route: ActivatedRoute,
        public toastr: ToastrService,
        public customerKeyService: CustomerKeyService,
        private customerService: CustomerService) {
        // Init Key
        this.customerKeyService.watchContext.next(this);
    }

    ngOnInit() {
        this.route.params.subscribe(params => this.getDetailCustomer(params.id));
    }

    selectTab(id) {
        this.tabSet.select(id);
    }

    getDetailCustomer(id) {
        this.customerId = id;
        this.customerService.getDetailCustomer(this.customerId).subscribe(res => {
            try {
                this.customer = res.data;
                this.customer['address'] = [...((this.customer['company_type'] === 'CP') ? res.data['primary'] : res.data['head_office']),
                ...res.data['billing'], ...res.data['shipping']];
            } catch (e) {
                console.log(e);
            }
        });
    }

}
