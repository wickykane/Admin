import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { CommonService } from '../../../services/common.service';
import { CustomerService } from '../customer.service';

//  modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SiteModalComponent } from '../../../shared/modals/site.modal';

import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { Helper } from '../../../shared/index';

@Component({
    selector: 'app-customer-create',
    templateUrl: './customer-create.component.html',
    styleUrls: ['./customer.component.scss'],
    animations: [routerTransition()]
})
export class CustomerCreateComponent implements OnInit, OnDestroy {

    generalForm: FormGroup;

    public addresses: any = [];
    public bank_accounts: any = [];
    public contacts: any = [];
    public sites: any = [];
    public company_child: any = [];

    public listMaster = {};
    public listTypeAddress: any = [];
    public listCountry: any = [];
    public listBank: any = [];
    public routeList = [];

    public flagAddress: boolean;
    public flagSite: boolean;
    public flagAccount: boolean;
    public flagContact: boolean;

    public countCode: number;
    public textCode: string;

    hotkeyCtrlLeft: Hotkey | Hotkey[];
    hotkeyCtrlRight: Hotkey | Hotkey[];

    constructor(public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService,
        public vRef: ViewContainerRef,
        private customerService: CustomerService,
        private modalService: NgbModal,
        private hotkeysService: HotkeysService,
        private commonService: CommonService,
        public helper: Helper) {
        this.generalForm = fb.group({
            'buyer_type': [null, Validators.required],
            'code': [null, Validators.required],
            'company_name': [null],
            'registration_no': [null],
            'phone': [''],
            'fax': [''],
            'email': [null],
            'credit_limit': [null],
            'credit_sts': 2,
            'sale_person_id': [null],
            'first_name': [null],
            'last_name': [null],
            'username': [null],
            'password': [null]
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
        this.listTypeAddress = [{ id: 1, name: 'Billing' }, { id: 2, name: 'Shipping' }];
        this.getListCustomerType();
        this.getListSalePerson();
        this.getListCountryAdmin();
        this.getListBank();
        this.customerService.getRoute().subscribe(res => { this.routeList = res.data; });

    }

    ngOnDestroy() {
        this.hotkeysService.remove(this.hotkeyCtrlLeft);
        this.hotkeysService.remove(this.hotkeyCtrlRight);
    }
    /**
     * get list master data
     */
    getListCustomerType() {
        this.customerService.getListCustomerType().subscribe(res => {
            try {
                this.listMaster['customerType'] = res.data;
            } catch (e) {

            }
        });
    }

    getListTypeAddress() {
        this.customerService.generateSiteCode().subscribe(res => {
            try {
                if (this.generalForm.value.buyer_type === 'CP') {
                    this.generalForm.patchValue({ code: res.data.CP.code });
                    this.countCode = Number(res.data.CP.no);
                    this.textCode = res.data.CP.text;
                } else {
                    this.generalForm.patchValue({ code: res.data.PS.code });
                }
            } catch (e) {

            }
        });
    }

    getListCountryAdmin() {
        this.commonService.getListCountry().subscribe(res => {
            try {
                this.listCountry = res.data;
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
    getListSalePerson() {
        this.commonService.getOrderReference().subscribe(res => {
            try {
                this.listMaster['salePersons'] = res.data.sale_mans;
            } catch (e) {
                console.log(e);
            }
        });
    }
    //  change customer Type
    changeCustomerType() {
        this.getListTypeAddress();

        if (this.generalForm.value.buyer_type === 'CP') {
            const tempType = [{ id: 4, name: 'Head Office' }];

            this.addresses = [{
                type: 4, listType: tempType, listCountry: this.listCountry, listState: []
            }, {
                type: 1, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
            }, {
                type: 2, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
            }];
        } else {
            const tempType1 = [{ id: 3, name: 'Primary' }];

            this.addresses = [{
                type: 3, listType: tempType1, listCountry: this.listCountry, listState: []
            }, {
                type: 1, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
            }, {
                type: 2, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
            }];
        }

    }

    changeCountry(item) {
        const params = {
            country: item.country_code
        };
        this.commonService.getStateByCountry(params).subscribe(res => {
            try {
                item.listState = res.data;
            } catch (e) {

            }
        });
    }

    changeBank(item) {
        console.log(item);
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

    dupAddress() {
        var p = this.addresses[0];
        var k = Object.keys(p);
        for (let i = 1; i < this.addresses.length; i++) {
            k.map(key => { key != 'type' && key != 'listType' && (this.addresses[i][key] = p[key]) });
        }
    }

    //  add new row address
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
    //  add new row contact
    addNewContact() {
        this.contacts.push({});
    }

    removeContact(index) {
        this.contacts.splice(index, 1);
    }

    checkIsDefault($event, idx) {
        for (let i = 0; i < this.addresses.length; i++) {
            const item = this.addresses[i];
            if (idx != i && item.type == this.addresses[idx].type) {
                item.is_default = false;
            }
        }
    }

    //  add new Site

    addNewSite(item?) {
        var k = ['name', 'country_code', 'address_1', 'city', 'state_id', 'zip_code'];
        for (let i = 0; i < this.addresses.length; i++) {
            for (let j = 0; j < k.length; j++) {
                if (!this.addresses[i][k[j]]) {
                    return this.toastr.error('Please fulfill all the addresses before creating the site.');
                }
            };
        }
        const modalRef = this.modalService.open(SiteModalComponent, { size: 'lg' });
        modalRef.componentInstance.item = item;
        modalRef.componentInstance.paddr = this.addresses;
        modalRef.result.then(res => {
            if (!this.helper.isEmptyObject(res)) {
                console.log(res);
                const state = res.addresses[0].listState.filter(x => {
                    return res.addresses[0].state_id === x.id;
                });
                const objSite = {
                    code: res.code,
                    full_name: res.full_name,
                    country: res.addresses[0].listCountry.map(x => {
                        if (res.addresses[0].country_code === x.cd) {
                            return x.name;
                        }
                    }),
                    name: res.addresses[0].name,
                    address_line: res.addresses[0].address_1,
                    address_line2: res.addresses[0].address_2,
                    city_name: res.addresses[0].city,
                    state: state[0].name,
                    zip_code: res.addresses[0].zip_code
                };
                const full_site = { ...objSite, ...res };
                this.sites.push(full_site);
                this.company_child.push(res);
                this.countCode++;
            }
        });
        modalRef.componentInstance.info = {
            parent_company_name: this.generalForm.value.full_name,
            code: this.countCode,
            textCode: this.textCode
        };
    }

    removeSite(index) {
        console.log(index);
        this.sites.splice(index, 1);
        console.log(this.sites);
    }

    createCustomer() {
        if (this.generalForm.valid) {
            const params = this.generalForm.value;
            params['addresses'] = _.cloneDeep(this.addresses);
            params['bank_accounts'] = _.cloneDeep(this.bank_accounts);
            params['contacts'] = _.cloneDeep(this.contacts);
            params['addresses'].forEach(item => {
                delete item.listType;
                delete item.listCountry;
                delete item.listState;
            });
            params['bank_accounts'].forEach(item => {
                delete item.listBank;
                delete item.listBranch;
            });
            params['sites'] = _.cloneDeep(this.company_child);
            params['sites'].forEach(item => {
                item.addresses.map(add => {
                    delete add.listType;
                    delete add.listCountry;
                    delete add.listState;
                });
                item.bank_accounts.map(add => {
                    delete add.listBank;
                    delete add.listBranch;
                });
            });
            if (params['buyer_type'] === 'CP') {
                delete params['email'];
                delete params['first_name'];
                delete params['last_name'];
                delete params['username'];
                delete params['password'];
                delete params['pwd_cfrm'];
            } else {
                delete params['company_name'];
            }

            this.customerService.createCustomer(params).subscribe(
                res => {
                    console.log(res);
                    try {

                        setTimeout(() => {
                            this.router.navigate(['/customer']);
                        }, 2000);
                        this.toastr.success(res.message);
                    } catch (e) {
                        console.log(e);
                    }
                },
                err => {
                    console.log(err);
                    // this.toastr.error(err.message);
                });

        }
        // this.contacts.forEach(obj => {
        //     obj['pwd_cfrm'] = obj.pwd;
        // });
        // if (this.generalForm.valid) {
        //     const params = { ...this.generalForm.value };
        //     params['user'] = [];
        //     if (this.contacts.length > 0) {
        //         params['user'] = this.contacts;

        //     }
        //     params['banks'] = [];
        //     if (this.bank_accounts.length > 0) {
        //         params['banks'] = this.bank_accounts;

        //     }
        //     params['company_child'] = [];
        //     params['company_child'] = this.company_child;

        //     params['primary'] = [];
        //     params['billing'] = [];
        //     params['shipping'] = [];

        //     this.addresses.forEach(obj => {
        //         if (obj.type === 1) {
        //             params['primary'].push(obj);
        //         }
        //         if (obj.type === 2) {
        //             params['billing'].push(obj);
        //         }
        //         if (obj.type === 3) {
        //             params['shipping'].push(obj);
        //         }
        //     });

        //     if (this.generalForm.value.buyer_type === 'CP') {
        //         delete params.first_name;
        //         delete params.last_name;
        //         delete params.pwd;
        //         delete params.pwd_cfrm;
        //         delete params.username;
        //         delete params.email;
        //     } else {
        //         params.pwd_cfrm = params.pwd;
        //         delete params.full_name;

        //     }
        //     const data = { ...params };
        //     // data.banks.forEach(item => {
        //     //     delete item.listBank;
        //     //     delete item.listBranch;
        //     // });
        //     console.log(data);
        //     // return;

        //     this.customerService.createCustomer(data).subscribe(
        //         res => {
        //             console.log(res);
        //             try {

        //                 setTimeout(() => {
        //                     this.router.navigate(['/customer']);
        //                 }, 2000);
        //                 this.toastr.success(res.message);
        //             } catch (e) {
        //                 console.log(e);
        //             }
        //         },
        //         err => {
        //             console.log(err);
        //             this.toastr.error(err.message);
        //         });
        // }

    }

}
