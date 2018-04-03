import { TableService } from './../../services/table.service';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ItemService } from './item.service';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

    public title: string = '';
    public listMaster = {};

    constructor(public activeModal: NgbActiveModal,
        public itemService: ItemService,
        public fb: FormBuilder,
        public toastr: ToastsManager,
        private vRef: ViewContainerRef,
        public tableService: TableService) {
        this.toastr.setRootViewContainerRef(vRef);

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

        //Assign get list function name, override variable here

    }

    ngOnInit() {
        //Init Fn
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

    //action change country
    changeCountry(id) {
        let params = {
            country: id
        }
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
