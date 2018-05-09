import { TableService } from './../../services/table.service';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ItemService } from './item.service';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-site-modal',
    templateUrl: './site.modal.html',
    styleUrls: ['./site.modal.scss']
})
export class SiteModalComponent implements OnInit {
    @Input() info;

    /**
     * Variable Declaration
     */
    generalForm: FormGroup;

    public address: any = [];
    public bank_account: any = [];
    public bank_card: any = [];
    public contact: any = [];
    public site: any = [];

    public listMaster = {};
    public listTypeAddress: any = [];
    public listCountry: any = [];
    public listBank: any = [];

    constructor(public fb: FormBuilder,
        public router: Router,
        public toastr: ToastsManager,
        public vRef: ViewContainerRef,
        private itemService: ItemService,
        private modalService: NgbModal,
        public activeModal: NgbActiveModal) {
        this.toastr.setRootViewContainerRef(vRef);
        this.generalForm = fb.group({
            'parent_company_name': [null],
            'site_code': [null],
            'site_name': [null, Validators.required],
            'registration_no': [null],
            'phone': [null],
            'fax': [null],
            'credit_limit': [null],
            'sale_person': [null]
        });

    }

    ngOnInit() {
        /**
         * Init Data
         */
         this.listTypeAddress = [{ id: 4, name: 'Primary' }, { id: 2, name: 'Billing' }, { id: 3, name: 'Shipping' }];
         this.address = [{
             type: 4, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
         }, {
             type: 2, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
         }, {
             type: 3, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
         }];

         
        this.getListSalePerson();
        this.getListCountry();
        this.getListBank();

    }
    /**
     * get list master data
     */
    getListSalePerson() {
        this.listMaster['salePersons'] = [];
    }

    getListCountry() {
        this.listCountry = [];
    }

    getListBank() {
        this.listBank = [];
    }



    changeCountry(item) {
        item.listState = [];
    }

    changeBank(item) {
        item.listBranch = [];
    }




    // add new row address
    addNewAddress() {
        this.address.push({
            listType: this.listTypeAddress,
            listCountry: this.listCountry,
            listState: []
        });
    }

    removeAddress(index) {
        this.address.splice(index, 1);
    }

    // add new row bank account
    addNewBankAccount() {
        this.bank_account.push({
            listBank: this.listBank,
            listBranch: []
        });
    }

    removeBankAccount(index) {
        this.bank_account.splice(index, 1);
    }
    // add new row bank card
    addNewBankCard() {
        this.bank_card.push({
            listCardType: []
        });
    }

    removeBankCard(index) {
        this.bank_card.splice(index, 1);
    }
    // add new row contact
    addNewContact() {
        this.contact.push({});
    }

    removeContact(index) {
        this.contact.splice(index, 1);
    }





}
