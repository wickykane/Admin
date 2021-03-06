import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../services/table.service';

import { ItemService } from './item.service';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'address-modal-content',
    templateUrl: './address.modal.html'
})
export class AddressModalContent implements OnInit {
    @Input() input;
    @Input() state;

    /**
     * Variable Declaration
     */
    generalForm: FormGroup;

    public title: string;
    public listMaster = {};

    constructor(public activeModal: NgbActiveModal,
        public itemService: ItemService,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService) {


        this.generalForm = fb.group({
            'type': 1,
            'address_name': [null, Validators.required],
            'email': [null],
            'tax_number': [null],
            'phone': [null],
            'address_line': [null, Validators.required],
            'country_code': [null, Validators.required],
            'state_id': [null],
            'city_name': [null, Validators.required],
            'zip_code': [null, Validators.required]
        });

        //  Assign get list function name, override variable here

    }

    ngOnInit() {
        //  Init Fn
        if (!this.state) {
            this.generalForm.patchValue(this.input);
        }
        this.title = this.state ? this.title = 'New Address' : this.title = 'Edit Address';
        this.getListCountry();
    }


    getListCountry() {
        this.itemService.getListCountry().subscribe(res => {
            try {
                console.log(res);
                this.listMaster['countries'] = res.data;
                if (!this.state) {
                    this.changeCountry(this.input['country_code']);
                }
            } catch (e) {
                console.log(e);
            }
        });
    }

    //  action change country
    changeCountry(id) {
        const params = {
            country: id
        };
        this.getStateByCountry(params);
    }

    getStateByCountry(params) {
        this.itemService.getStateByCountry(params).subscribe(res => {
            try {
                this.listMaster['state'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

    updateData() {
        this.activeModal.close(this.generalForm.value);
    }


}
