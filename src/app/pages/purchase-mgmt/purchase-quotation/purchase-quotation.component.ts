import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { routerTransition } from '../../../router.animations';
import { Router } from '@angular/router';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';


@Component({
    selector: 'app-quotation',
    templateUrl: './purchase-quotation.component.html',
    styleUrls: ['./purchase-quotation.component.scss'],
    animations: [routerTransition()]
})
export class QuotationComponent implements OnInit {

    items: any = [];

    searchForm: FormGroup;

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastsManager, vcr: ViewContainerRef) {

        this.searchForm = fb.group({
            cd: [""],
            supp_id: [""],
            sts: [""],
            rqst_dt: [""]
        });

        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
    }
}
