import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from "../purchase.service";

//modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemModalContent } from "../../../shared/modals/item.modal";
import { AddressModalContent } from "../../../shared/modals/address.modal";


import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { routerTransition } from '../../../router.animations';

@Component({
    selector: 'app-supplier-detail',
    templateUrl: './supplier-detail.component.html',
    styleUrls: ['./supplier.component.scss'],
    animations: [routerTransition()]
})

export class SupplierDetailComponent implements OnInit {

    generalForm: FormGroup;
    primaryForm: FormGroup;
    billingForm: FormGroup;
    shippingForm: FormGroup;

    public users: any = [];
    public listFile: any = [];
    public addressList: any = [];
    public imageSelected: string = '';
    public listMaster = {};

    public ADDRESS_TYPE = {
        3 : 'MAIN',
        2 : 'SHIPPING',
        1 : 'BILLING'
    };

    constructor(public fb: FormBuilder,
        public router: Router,
        public route: ActivatedRoute,
        public toastr: ToastsManager,
        public vRef: ViewContainerRef,
        private purchaseService: PurchaseService,
        private modalService: NgbModal) {
        this.toastr.setRootViewContainerRef(vRef);
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
    }

    ngOnInit() {
        this.route.params.subscribe( params => this.getDetailSupplier(params.id) );
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

    mergeAddressList(data) {
        var addressList = [];

        if(data['shipping'].length > 0) addressList = addressList.concat(data['shipping']);
        if(data['billing'].length > 0) addressList = addressList.concat(data['billing']);

        // add property isCheck to array
        addressList.map( function(addr) {
            addr.isChecked = false;
            return addr;
        });
        return addressList;
    }

    addNewAddress() {
        const modalRef = this.modalService.open(AddressModalContent, {size: 'lg'});
        modalRef.result.then(res => {
            console.log(res)
        });
        modalRef.componentInstance.input = {};
        modalRef.componentInstance.state = true;
    }

    updateAddress(data) {
        const modalRef = this.modalService.open(AddressModalContent, {size: 'lg'});
        modalRef.result.then(res => {
            console.log(res)
        });
        modalRef.componentInstance.input = data;
        modalRef.componentInstance.state = false;
    }

    getDetailSupplier(id) {
        this.purchaseService.getDetailBuyer(id).subscribe(res => {
            try {
                this.generalForm.patchValue(res.results);
                this.primaryForm.patchValue(res.results['primary'][0]);
                this.imageSelected = res.results.img;
                this.users = res.results['user'];

                this.changeCountry(res.results['primary'][0]['country_code'], 'states_primary');
                this.addressList = this.mergeAddressList(res.results);
            } catch(e) {

            }
        })
    }

    updateSupplier() {
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
