import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from "../purchase.service";

//modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemModalContent } from "../../../shared/modals/item.modal";


import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { routerTransition } from '../../../router.animations';

@Component({
  selector: 'app-supplier-create',
  templateUrl: './supplier-create.component.html',
  styleUrls: ['./supplier.component.scss'],
  animations: [routerTransition()]
})
export class SupplierCreateComponent implements OnInit {

    generalForm: FormGroup;
    primaryForm: FormGroup;
    billingForm: FormGroup;
    shippingForm: FormGroup;

    public users: any = [];

    public listMaster = {};

    constructor(public fb: FormBuilder,
        public router: Router,
        public  toastr: ToastsManager,
        public vRef: ViewContainerRef,
        private purchaseService: PurchaseService,
        private modalService: NgbModal) {
            this.toastr.setRootViewContainerRef(vRef);
            this.generalForm = fb.group({
                'full_name': [null, Validators.required],
                'email': [null, Validators.required],
                'phone': [null],
                'fax': [null],
                'website': [null]
            });
            this.primaryForm = this.billingForm = this.shippingForm = fb.group({
                'name': [null, Validators.required],
                'email': [null],
                'tax_number': [null],
                'phone': [null],
                'address_line': [null, Validators.required],
                'country_code': [null, Validators.required],
                'state_id': [null],
                'city_name': [null, Validators.required],
                'zip_code': [null, Validators.required]
            });
        }

    ngOnInit() {
        this.getListCountry();
    }

    getListCountry() {
        this.purchaseService.getListCountry().subscribe(res => {
            try {
                this.listMaster['countries'] = res.results;
            } catch (e) {
                console.log(e);
            }
        });
    }


}
