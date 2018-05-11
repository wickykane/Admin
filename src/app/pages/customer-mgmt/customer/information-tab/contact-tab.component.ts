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
    @Input() set listData(data) {
        this.list.items = data || [];
    }

    public list = {
        items: []
    };

    searchForm: FormGroup;

    constructor(private customerService: CustomerService) { }

    ngOnInit() {}


    /**
     * Internal Function
     */

    hideCharacter(text) {
        if (!text) {
            return text;
        }
        return text.replace(/./g, 'x');
    }
}
