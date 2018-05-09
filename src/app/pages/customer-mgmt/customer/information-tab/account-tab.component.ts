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
    @Input() customerId;
    public list = {
        accounts: [],
        cards: [],
    };

    constructor(private customerService: CustomerService) {

    }

    ngOnInit() {
        // Init Fn
        this.getListAccount();
        this.getListCard();
    }


    /**
     * Internal Function
     */

    getListAccount() {
        const params = Object.assign({});
        Object.keys(params).forEach((key) => (params[key] == null || params[key] === '') && delete params[key]);

        this.customerService.getListAccount(params).subscribe(res => {
            try {
                this.list.accounts = res.data.rows;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getListCard() {
        const params = Object.assign({});
        Object.keys(params).forEach((key) => (params[key] == null || params[key] === '') && delete params[key]);

        this.customerService.getListCard(params).subscribe(res => {
            try {
                this.list.cards = res.data.rows;
            } catch (e) {
                console.log(e);
            }
        });
    }

}
