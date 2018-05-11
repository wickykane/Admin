import { TableService } from './../../../../services/table.service';
import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../customer.service';


@Component({
    selector: 'app-customer-site-tab',
    templateUrl: './site-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
})
export class CustomerSiteTabComponent implements OnInit {

    /**
     * letiable Declaration
     */
    @Input() set listData(data) {
        this.list.items = data || [];
    }

    public list = {
        items: []
    };

    constructor(
        private customerService: CustomerService) {
    }

    ngOnInit() {}
}
