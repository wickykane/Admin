import { Component, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../services/table.service';

import { ItemService } from './item.service';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import {CommonService} from '../../services/common.service';

@Component({
    selector: 'app-site-modal',
    templateUrl: './site.modal.html',
    styleUrls: ['./site.modal.scss']
})
export class SiteModalComponent implements OnInit, OnDestroy {
    @Input() info;

    /**
     * Variable Declaration
     */
    generalForm: FormGroup;

    public address: any = [];
    public bank_account: any = [];
    public bank_card: any = [];
    public contact: any = [];

    public listMaster = {};
    public listTypeAddress: any = [];
    public listCountry: any = [];
    public listBank: any = [];

    public flagAddress: boolean;
    public flagAccount: boolean;
    public flagContact: boolean;

    hotkeyCtrlLeft: Hotkey | Hotkey[];
    hotkeyCtrlRight: Hotkey | Hotkey[];

    constructor(public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService,
        private itemService: ItemService,
        private modalService: NgbModal,
        private hotkeysService: HotkeysService,
        private commonService: CommonService,
        public activeModal: NgbActiveModal) {

        this.generalForm = fb.group({
            'parent_company_name': [null],
            'code': [null, Validators.required],
            'full_name': [null, Validators.required],
            'registration': [null],
            'phone': [null],
            'fax': [null],
            'line_of_credit': [null],
            'credit_sts': 2,
            'sale_man_id': 1,
        });

        this.hotkeyCtrlRight = hotkeysService.add(new Hotkey('alt+r', (event: KeyboardEvent): boolean => {
            this.flagAddress = true;
            return false; //  Prevent bubbling
        }));


    }

    ngOnInit() {
        /**
         * Init Data
         */
        let code = this.info.code;
        code++;
        this.listTypeAddress = [{ id: 2, name: 'Billing' }, { id: 3, name: 'Shipping' }];
        this.generalForm.patchValue({ parent_company_name: this.info.parent_company_name });
        this.generalForm.patchValue({ code: String(this.info.textCode + '0000' + code) });

        this.getListSalePerson();
        this.getListCountryAdmin();
        this.getListBank();

    }

    ngOnDestroy() {
        this.hotkeysService.remove(this.hotkeyCtrlLeft);
        this.hotkeysService.remove(this.hotkeyCtrlRight);
    }
    /**
     * get list master data
     */
    getListSalePerson() {
        this.listMaster['salePersons'] = [];
    }

    getListCountryAdmin() {
        this.itemService.getListCountryAdmin().subscribe(res => {
            try {
                this.listCountry = res.data;
                this.changeCustomerType();
            } catch (e) {
                console.log(e);
            }
        });
    }

    getListBank() {
        this.commonService.getAllListBank().subscribe(res => {
            try {
                this.listBank = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }


    //  change customer Type
    changeCustomerType() {

        const tempType1 = [{ id: 1, name: 'Head Office' }];

        this.address = [{
            type: 1, listType: tempType1, listCountry: this.listCountry, listState: []
        }, {
            type: 2, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
        }, {
            type: 3, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
        }];


    }

    changeCountry(item) {
        const params = {
            country: item.country_code
        };
        this.itemService.getStateByCountry(params).subscribe(res => {
            try {
                item.listState = res.data;
            } catch (e) {

            }
        });
    }

    changeBank(item) {
        item.bank_swift = this.listBank.map(x => {
            if (item.bank_id === x.id) {
                return x.swift;
            }
        })[0];

        this.commonService.getListBranchByBank(item.bank_id).subscribe(res => {
            try {
                item.listBranch = res.data;
            } catch (e) {

            }
        });
    }

    changeBranch(item) {
        item.full_address = item.listBranch.map(x => {
            if (item.branch_id === x.id) {
                return x.address;
            }
        })[0];
    }




    //  add new row address
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

    //  add new row bank account
    addNewBankAccount() {
        this.bank_account.push({
            listBank: this.listBank,
            listBranch: []
        });
    }

    removeBankAccount(index) {
        this.bank_account.splice(index, 1);
    }
    //  add new row bank card
    addNewBankCard() {
        this.bank_card.push({
            listCardType: []
        });
    }

    removeBankCard(index) {
        this.bank_card.splice(index, 1);
    }
    //  add new row contact
    addNewContact() {
        this.contact.push({});
    }

    removeContact(index) {
        this.contact.splice(index, 1);
    }



    applyData() {
        this.contact.forEach(obj => {
            obj['pwd_cfrm'] = obj.pwd;
        });
        //  this.bank_account.forEach(obj => {
        //      delete obj['listBank'];
        //      delete obj['listBranch'];
        //  });
        //  this.address.forEach(obj => {
        //    delete obj['listCountry'];
        //    delete obj['listState'];
        //  });
        if (this.generalForm.valid) {
            const params = {...this.generalForm.value};
            params['user'] = [];
            if (this.contact.length > 0) {
                params['user'] = this.contact;

            }
            params['banks'] = [];
            if (this.bank_account.length > 0) {
                params['banks'] = this.bank_account;

            }
            params['primary'] = [];
            params['billing'] = [];
            params['shipping'] = [];

            this.address.forEach(obj => {
                if (obj.type === 1) {
                    params['primary'].push(obj);
                }
                if (obj.type === 2) {
                    params['billing'].push(obj);
                }
                if (obj.type === 3) {
                    params['shipping'].push(obj);
                }
            });

            this.closeModal(params);

        }

    }

    closeModal(data) {
        this.activeModal.close(data);
    }

    closeX() {
        const data = {};
        this.activeModal.close(data);
    }



}
