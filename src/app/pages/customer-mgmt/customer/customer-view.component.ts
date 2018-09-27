import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../customer.service';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { TableService } from './../../../services/table.service';
import { CustomerKeyService } from './keys.control';

@Component({
    selector: 'app-customer-view',
    templateUrl: './customer-view.component.html',
    styleUrls: ['./customer.component.scss'],
    animations: [routerTransition()],
    providers: [CustomerKeyService],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomerViewComponent implements OnInit {

    public customer = {};
    public customerId;
    public listMaster = {};
    public addresses = [];


    @ViewChild('tabSet') tabSet;

    constructor(
        public router: Router,
        public tableService: TableService,
        public route: ActivatedRoute,
        public toastr: ToastrService,
        public customerKeyService: CustomerKeyService,
        private customerService: CustomerService,
        private cd: ChangeDetectorRef) {
        //  Init Key
        this.customerKeyService.watchContext.next(this);
    }

    ngOnInit() {
        this.route.params.subscribe(params => this.getDetailCustomer(params.id));
    }

    refresh() {
        this.cd.detectChanges();
    }

    selectTab(id) {
        this.tabSet.select(id);
    }

    getDetailCustomer(id) {
        this.customerId = id;
        this.customerService.getDetailCustomer(this.customerId).subscribe(res => {
            try {
                this.customer = res.data;
                for (let i = 0; i < this.customer['head_office'].length; i++) {
                    this.setAddressType(this.customer['head_office'][i], 1, this.customer['company_type'] === 'CP')
                }
                for (let i = 0; i < this.customer['primary'].length; i++) {
                    this.setAddressType(this.customer['primary'][i], 1, this.customer['company_type'] === 'CP')
                }
                for (let i = 0; i < this.customer['billing'].length; i++) {
                    this.setAddressType(this.customer['billing'][i], 2, this.customer['company_type'] === 'CP')
                }
                for (let i = 0; i < this.customer['shipping'].length; i++) {
                    this.setAddressType(this.customer['shipping'][i], 3, this.customer['company_type'] === 'CP')
                }
                this.customer['address'] = [...((this.customer['company_type'] === 'CP') ? res.data['head_office'] : res.data['primary']),
                ...res.data['billing'], ...res.data['shipping']];

                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }
    setAddressType(address, type, is_cp) {
        const listTypeAddress = ['', 'Head Office', 'Billing', 'Shipping'];
        is_cp && (address.address_type = listTypeAddress[type]);
        !is_cp && (address.address_type = type > 1 ? listTypeAddress[type] : 'Primary');
    }
}
