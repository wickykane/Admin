import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../customer.service';


@Component({
    selector: 'app-customer-contact-tab',
    templateUrl: './contact-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
})
export class CustomerContactTabComponent implements OnInit {

    /**
     * letiable Declaration
     */
    @Input() customerId;

    public list = {
        items: []
    };

    searchForm: FormGroup;

    constructor(private customerService: CustomerService) { }

    ngOnInit() {
        // Init Fn
        this.getList();
    }


    /**
     * Internal Function
     */

    hideCharacter(text) {
        if (!text) {
            return text;
        }
        return text.replace(/./g, 'x');
    }

    getList() {
        const params = Object.assign({});
        Object.keys(params).forEach((key) => (params[key] == null || params[key] === '') && delete params[key]);

        this.customerService.getListContact(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
            } catch (e) {
                console.log(e);
            }
        });
    }

}
