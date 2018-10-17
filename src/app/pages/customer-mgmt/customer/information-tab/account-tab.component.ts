import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { CustomerService } from '../../customer.service';


@Component({
    selector: 'app-customer-account-tab',
    templateUrl: './account-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
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
    public listCreditCard = [];
    constructor(private customerService: CustomerService, private cd: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.getListCreditCard();
    }

    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    getListCreditCard() {
        this.customerService.getCreditCard().subscribe(res => {
            this.listCreditCard = res.data;
            this.refresh();
            // this.credit_cards.forEach(card => { card.listCard = res.data });
        });
    }
    getCardType(id) {
        let name = '';
        this.listCreditCard.forEach(item => {
            if (item.id === id) {
                name = item.name;
            }
        });
        return name;
    }
}
