import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { CustomerService } from '../../customer.service';


@Component({
    selector: 'app-customer-account-tab',
    templateUrl: './account-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
})
export class CustomerAccountTabComponent implements OnInit {

    /**
     * letiable Declaration
     */
    @Input() set listData(data) {
        if (data) {
            this.list.accounts = data['bank_accounts'] || [];
            this.list.cards = data['credit_cards'] || [];
        }
    }

    public list = {
        accounts: [],
        cards: [],
    };

    constructor(private customerService: CustomerService) {

    }

    ngOnInit() {}
}
