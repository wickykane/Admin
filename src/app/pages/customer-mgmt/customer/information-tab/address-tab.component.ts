import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { CustomerService } from '../../customer.service';


@Component({
    selector: 'app-customer-address-tab',
    templateUrl: './address-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
})
export class CustomerAddressTabComponent implements OnInit {

    /**
     * letiable Declaration
     */
    @Input() customerId;
    public list = {
        items: []
    };

    constructor( private customerService: CustomerService) {

    }

    ngOnInit() {
        // Init Fn
        this.getList();
    }


    /**
     * Internal Function
     */

    getList() {
        const params = Object.assign({});
        Object.keys(params).forEach((key) => (params[key] == null || params[key] === '') && delete params[key]);

        this.customerService.getListAddress(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
            } catch (e) {
                console.log(e);
            }
        });
    }

}
