import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from "../purchase.service";

//modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemModalContent } from "../../../shared/modals/item.modal";

import { ToastrService } from 'ngx-toastr';
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
    public listFile: any = [];
    public imageSelected: string = '';

    public listMaster = {};

    constructor(public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService,
        public vRef: ViewContainerRef,
        private purchaseService: PurchaseService,
        private modalService: NgbModal) {
         
        this.generalForm = fb.group({
            'full_name': [null, Validators.required],
            'email': [null, Validators.required],
            'phone': [null],
            'fax': [null],
            'website': [null],
            'is_supplier': true
        });
        this.primaryForm = fb.group({
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
        this.billingForm = fb.group({
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
        this.shippingForm = fb.group({
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

    //data master country
    getListCountry() {
        this.purchaseService.getListCountry().subscribe(res => {
            try {
                this.listMaster['countries'] = res.results;
            } catch (e) {
                console.log(e);
            }
        });
    }
    //action change country
    changeCountry(id, flag) {
        let params = {
            country: id
        }
        this.getStateByCountry(params, flag);
    }

    getStateByCountry(params, name) {
        this.purchaseService.getStateByCountry(params).subscribe(res => {
            try {
                this.listMaster[name] = res.results;
                console.log(this.listMaster);
            } catch (e) {
                console.log(e);
            }
        });
    }
    //action copy address
    copyToAddress(flag) {
        if (flag == 'billing') {
            this.billingForm.patchValue(this.primaryForm.value);
            this.listMaster['states_billing'] = this.listMaster['states_primary'];
        }
        if (flag == 'shipping') {
            this.shippingForm.patchValue(this.billingForm.value);
            this.listMaster['states_shipping'] = this.listMaster['states_billing'];
        }
    }

    addNewLine() {
        this.users.push({});
    }

    removeLine(index) {
        this.users.splice(index, 1);
    }

    onFileChange(event) {
        this.listFile = [];
        this.imageSelected = '';
        let reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            let files = event.target.files;
            this.listFile = Object.assign([], files);
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                reader.readAsDataURL(file);
                reader.onload = (e) => {
                    this.imageSelected = e.target['result'];
                }
            }

        }
    }

    createSupplier() {

        let params = Object.assign({}, this.generalForm.value);
        params['user'] = Object.assign([], this.users);
        params['shipping'] = [];
        params['shipping'].push(this.shippingForm.value);
        params['primary'] = [];
        params['primary'].push(this.primaryForm.value);
        params['billing'] = [];
        params['billing'].push(this.billingForm.value);

        let data = {
            data: JSON.stringify(params),
            image: this.listFile[0] || null
        }

        this.purchaseService.createBuyer(data).subscribe(res => {
            try {
                setTimeout(() => {
                    this.router.navigate(['/purchase-management/supplier']);
                }, 2000);
                this.toastr.success(res.message);
            } catch (e) {
                console.log(e);
            }
        });
    }


}
