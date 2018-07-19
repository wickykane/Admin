import { Component, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../services/table.service';

import { CustomerService } from '../../pages/customer-mgmt/customer.service';
import { ItemService } from './item.service';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-site-modal',
    templateUrl: './site.modal.html',
    styleUrls: ['./site.modal.scss']
})
export class SiteModalComponent implements OnInit, OnDestroy {
    @Input() info;
    @Input() item;
    @Input() paddr;

    /**
     * Variable Declaration
     */
    generalForm: FormGroup;

    public addresses: any = [];
    public bank_accounts: any = [];
    public bank_card: any = [];
    public contacts: any = [];

    public listMaster = {};
    public listTypeAddress: any = [];
    public listCountry: any = [];
    public listBank: any = [];
    public routeList = [];


    public flagAddress: boolean;
    public flagAccount: boolean;
    public flagContact: boolean;

    hotkeyCtrlLeft: Hotkey | Hotkey[];
    hotkeyCtrlRight: Hotkey | Hotkey[];

    constructor(public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService,
        private itemService: ItemService,
        private customerService: CustomerService,
        private modalService: NgbModal,
        private hotkeysService: HotkeysService,
        private commonService: CommonService,
        public activeModal: NgbActiveModal) {

        this.generalForm = fb.group({
            'parent_company_name': [null],
            'site_code': [null, Validators.required],
            'site_name': [null, Validators.required],
            'registration_no': [null],
            'phone': [''],
            'fax': [''],
            'credit_limit': [null],
            'credit_sts': 2,
            'sale_person_id': [null],
            'payment_make': [null]
        });

        this.hotkeyCtrlRight = hotkeysService.add(new Hotkey('alt+r', (event: KeyboardEvent): boolean => {
            this.flagAddress = true;
            return false; //  Prevent bubbling
        }));


    }

    ngOnInit() {
        (async () => {
            await this.itemService.getListCountryAdmin().subscribe(res => { this.listCountry = res.data; this.changeCustomerType(); });
            this.listTypeAddress = [{ id: 2, name: 'Billing' }, { id: 3, name: 'Shipping' }];
            await this.commonService.getOrderReference().subscribe(res => this.listMaster['salePersons'] = res.data.sale_mans);
            await this.commonService.getAllListBank().subscribe(res => this.listBank = res.data);
            await this.customerService.getRoute().subscribe(res => { this.routeList = res.data; });
            await this.setData();
        })();
    }

    ngOnDestroy() {
        this.hotkeysService.remove(this.hotkeyCtrlLeft);
        this.hotkeysService.remove(this.hotkeyCtrlRight);
    }
    setData() {
        if (this.item) {
            console.log('3');
            this.generalForm.patchValue(this.item);
            this.contacts = this.item.contacts;
            this.addresses = this.item.addresses;
            console.log(this.addresses);
            this.bank_accounts = this.item.bank_accounts;
        } else {
            console.log('2');
            let code = this.info.code;
            code++;
            this.generalForm.patchValue({ parent_company_name: this.info.parent_company_name });
            this.generalForm.patchValue({ site_code: String(this.info.textCode + '0000' + code) });
        }
    }

    //  change customer Type
    changeCustomerType() {
        console.log('1');
        const tempType1 = [{ id: 4, name: 'Head Office' }];
        this.addresses = [{
            type: 4, listType: tempType1, listCountry: this.listCountry, listState: []
        }, {
            type: 1, listType: this.listTypeAddress, listCountry: this.listCountry, listState: [], is_default: false
        }, {
            type: 2, listType: this.listTypeAddress, listCountry: this.listCountry, listState: [], is_default: false
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
    checkIsDefault($event, idx) {
        for (let i = 0; i < this.addresses.length; i++) {
            const item = this.addresses[i];
            if (idx != i && item.type == this.addresses[idx].type) {
                item.is_default = false;
            }
        }
    }

    dupAddress() {
        var p = this.addresses[0];
        var k = Object.keys(p);
        for (let i = 1; i < this.addresses.length; i++) {
            k.map(key => { key != 'type' && key != 'listType' && (this.addresses[i][key] = p[key]) });
        }
    }

    //  add new row addresses
    addNewAddress() {
        this.addresses.push({
            listType: this.listTypeAddress,
            listCountry: this.listCountry,
            listState: []
        });
    }

    removeAddress(index) {
        this.addresses.splice(index, 1);
    }

    //  add new row bank account
    addNewBankAccount() {
        this.bank_accounts.push({
            listBank: this.listBank,
            listBranch: []
        });
    }

    removeBankAccount(index) {
        this.bank_accounts.splice(index, 1);
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
    //  add new row contacts
    addNewContact() {
        this.contacts.push({});
    }

    removeContact(index) {
        this.contacts.splice(index, 1);
    }



    applyData() {
        this.contacts.forEach(obj => {
            obj['pwd_cfrm'] = obj.pwd;
        });
        if (this.generalForm.valid) {
            const params = { ...this.generalForm.value };
            params['contacts'] = this.contacts;
            params['addresses'] = this.addresses;
            params['bank_accounts'] = this.bank_accounts;
            // params['user'] = [];
            // if (this.contacts.length > 0) {
            //     params['user'] = this.contacts;

            // }
            // params['banks'] = [];
            // if (this.bank_accounts.length > 0) {
            //     params['banks'] = this.bank_accounts;

            // }
            // params['primary'] = [];
            // params['billing'] = [];
            // params['shipping'] = [];

            // this.addresses.forEach(obj => {
            //     if (obj.type === 1) {
            //         params['primary'].push(obj);
            //     }
            //     if (obj.type === 2) {
            //         params['billing'].push(obj);
            //     }
            //     if (obj.type === 3) {
            //         params['shipping'].push(obj);
            //     }
            // });

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

    changePayment(e) {
        console.log(e.target.value, this.paddr);
        let val = e.target.value;
        let flag = !1;
        if (val * 1 == 1) {
            for (let i = 0; i < this.addresses.length; i++) {
                if (this.addresses[i].type == 1) {
                    for (let j = 0; j < this.paddr.length; j++) {
                        if (this.paddr[j].type == 1 && this.paddr[j].is_default) {
                            this.addresses[i] = JSON.parse(JSON.stringify(this.paddr[j]));
                            flag = !0;
                        }
                    }
                    if (!flag) {
                        for (let j = 0; j < this.paddr.length; j++) {
                            if (this.paddr[j].type == 1) {
                                this.addresses[i] = JSON.parse(JSON.stringify(this.paddr[j]));
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

}
