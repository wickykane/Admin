import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../customer.service';
import { TableService } from './../../../../services/table.service';


@Component({
    selector: 'app-customer-site-tab',
    templateUrl: './site-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
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
        private customerService: CustomerService, private cd: ChangeDetectorRef) {
    }

    ngOnInit() {}

    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }
}
