import { Component, OnInit } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from "../purchase.service";

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { routerTransition } from '../../../router.animations';

@Component({
    selector: 'app-quotation',
    templateUrl: './purchase-quotation-create.component.html',
    styleUrls: ['./purchase-quotation.component.scss'],
    animations: [routerTransition()]
})
export class QuotationCreateComponent implements OnInit {

    generalForm: FormGroup;

    public listMaster = {};

    constructor(public fb: FormBuilder,
        public toastr: ToastsManager,
        private purchaseService: PurchaseService) {
            this.generalForm = fb.group({
                'cd': [{ value: null, disabled: true }],
                'rqst_dt': [null, Validators.required],
                'supplier_id': [null, Validators.required],
            });
        }

    ngOnInit() {
        this.getListSupplier();
        this.generateCodePurchaseQuotation();
    }

    getListSupplier() {
        var params = { page: 1, length: 100 }
        this.purchaseService.getListSupplier(params).subscribe(res => {
            try {
                this.listMaster["supplier"] = res.results.rows;
            } catch (e) {
                console.log(e);
            }
        });
    }

    generateCodePurchaseQuotation() {
        this.purchaseService.generateCodePurchaseQuotation().subscribe(res => {
            try {
                this.generalForm.patchValue({cd: res.results.code});
            } catch(e) {

            }
        });
    }

}
