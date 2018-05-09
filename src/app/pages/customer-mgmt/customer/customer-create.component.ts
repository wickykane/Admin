import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../customer.service';

// modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SiteModalComponent } from '../../../shared/modals/site.modal';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { routerTransition } from '../../../router.animations';


@Component({
    selector: 'app-customer-create',
    templateUrl: './customer-create.component.html',
    styleUrls: ['./customer.component.scss'],
    animations: [routerTransition()]
})
export class CustomerCreateComponent implements OnInit {

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
        private customerService: CustomerService,
        private modalService: NgbModal) {
        this.toastr.setRootViewContainerRef(vRef);
        this.generalForm = fb.group({
            'customer_type': [null, Validators.required],
            'code': [null, Validators.required],
            'company_name': [null, Validators.required],
            'registration_no': [null],
            'phone': [null],
            'fax': [null],
            'email': [null],
            'credit_limit': [null],
            'sale_person': [null],
            'first_name': [null, Validators.required],
            'last_name': [null, Validators.required],
            'user_name': [null],
            'password': [null]
        });

    }

    ngOnInit() {
        /**
         * Init Data
         */
        this.listMaster['customerType'] = [{
            id: 'C',
            name: 'Company'
        }, {
            id: 'P',
            name: 'Personal'
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


    // change customer Type
    changeCustomerType() {
        if (this.generalForm.value.customer_type === 'C') {
            this.listTypeAddress = [{ id: 1, name: 'Head Office' }, { id: 2, name: 'Billing' }, { id: 3, name: 'Shipping' }];
            this.address = [{
                type: 1, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
            }, {
                type: 2, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
            }, {
                type: 3, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
            }];
        } else {
            this.listTypeAddress = [{ id: 4, name: 'Primary' }, { id: 2, name: 'Billing' }, { id: 3, name: 'Shipping' }];
            this.address = [{
                type: 4, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
            }, {
                type: 2, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
            }, {
                type: 3, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
            }];
        }

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

    // add new Site
    addNewSite() {
        const modalRef = this.modalService.open(SiteModalComponent, { size: 'lg' });
        modalRef.result.then(res => {

        });
        modalRef.componentInstance.info = {};
    }

    removeSite(index) {
        this.site.splice(index, 1);
    }


    createCustomer() {

    }


}
