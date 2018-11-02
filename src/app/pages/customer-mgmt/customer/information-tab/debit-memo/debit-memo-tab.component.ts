import { Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { TableService } from '../../../../../services/table.service';
import { cdArrowTable } from '../../../../../shared';
import { Helper } from '../../../../../shared/helper/common.helper';
import { CustomerService } from '../../../customer.service';


@Component({
    selector: 'app-customer-debit-memo-tab',
    templateUrl: './debit-memo-tab.component.html',
    styleUrls: ['../information-tab.component.scss'],
    providers: [HotkeysService]
})
export class CustomerDebitMemoTabComponent implements OnInit, OnDestroy {

    constructor(private customerService: CustomerService,
        public _hotkeysServiceContact: HotkeysService,
        public tableService: TableService,
        private helper: Helper,
        ) {
    }

    ngOnInit() {}

    ngOnDestroy() {
    }
}
