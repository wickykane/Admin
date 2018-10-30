import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { cdArrowTable } from '../../../shared';
import { CustomerService } from '../customer.service';
import { TableService } from './../../../services/table.service';
import { CustomerKeyViewService } from './keys.view.control';

@Component({
    selector: 'app-customer-view',
    templateUrl: './customer-view.component.html',
    styleUrls: ['./customer.component.scss'],
    animations: [routerTransition()],
    providers: [CustomerKeyViewService],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomerViewComponent implements OnInit {

    public customer = {};
    public customerId;
    public listMaster = {};
    public addresses = [];
    data = {};
    public selectedIndex = 0;
    @ViewChild(cdArrowTable) table: cdArrowTable;
    @ViewChild('tabSet') tabSet;
    constructor(
        public router: Router,
        public tableService: TableService,
        public route: ActivatedRoute,
        public toastr: ToastrService,
        public keyService: CustomerKeyViewService,
        private customerService: CustomerService,
        private _hotkeysService: HotkeysService,
        private cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.data['tab'] = {
            active: 0,
        };

        this.route.params.subscribe(params => this.getDetailCustomer(params.id));
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
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
    // selectTable() {
    //     this.selectedIndex = 0;
    //     this.table.element.nativeElement.querySelector('td').focus();
    // }
    back() {
        this.router.navigate(['/customer/']);
    }
    edit(id) {
        this.router.navigate(['/customer/edit', id]);
    }
    selectTab(id) {
        console.log(id);
        this.tabSet.select(id);
        this.refresh();
    }
    changeTab(step) {
        this.data['tab'].active = +this.tabSet.activeId;
        this.data['tab'].active += step;
        this.data['tab'].active = Math.min(Math.max(this.data['tab'].active, 0), 11);
        this.selectTab(String(this.data['tab'].active));
    }
    refresh() {
        if (!this.cd['destroyed']) { this.cd.detectChanges(); }
   }

}
