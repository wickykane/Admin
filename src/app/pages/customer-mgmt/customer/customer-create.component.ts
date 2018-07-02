import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

    public address: any = [];
    public bank_account: any = [];
    public bank_card: any = [];
    public contact: any = [];
    public site: any = [];
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
        public helper: Helper) {
        this.generalForm = fb.group({
            'buyer_type': [null, Validators.required],
            'code': [null],
            'full_name': [null],
            'registration': [null],
            'phone': [null],
            'fax': [null],
            'email': [null],
            'line_of_credit': [null],
            'credit_sts': 2,
            'sale_man_id': 1,
            'first_name': [null],
            'last_name': [null],
            'username': [null],
            'pwd': [null],
            'pwd_cfrm': [null]
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
        this.listTypeAddress = [{ id: 2, name: 'Billing' }, { id: 3, name: 'Shipping' }];
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
                if (this.generalForm.value.buyer_type ===  'CP') {
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

    getListSalePerson() {
        this.listMaster['salePersons'] = [];
    }

    getListCountryAdmin() {
        this.customerService.getListCountryAdmin().subscribe(res => {
            try {
                this.listCountry = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getListBank() {
        this.customerService.getListBank().subscribe(res => {
            try {
                this.listBank = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }


    //  change customer Type
    changeCustomerType() {
        this.getListTypeAddress();

        if (this.generalForm.value.buyer_type ===  'CP') {
            const tempType = [{ id: 1, name: 'Head Office' }];

            this.address = [{
                type: 1, listType: tempType, listCountry: this.listCountry, listState: []
            }, {
                type: 2, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
            }, {
                type: 3, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
            }];
        } else {
            const tempType1 = [{ id: 1, name: 'Primary' }];

            this.address = [{
                type: 1, listType: tempType1, listCountry: this.listCountry, listState: []
            }, {
                type: 2, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
            }, {
                type: 3, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
            }];
        }

    }

    changeCountry(item) {
        const params = {
            country: item.country_code
        };
        this.customerService.getStateByCountry(params).subscribe(res => {
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

        this.customerService.getListBranchByBank(item.bank_id).subscribe(res => {
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

    //  add new Site

    addNewSite() {
        const modalRef = this.modalService.open(SiteModalComponent, { size: 'lg' });
        modalRef.result.then(res => {
            if (!this.helper.isEmptyObject(res)) {
                const state = res.primary[0].listState.filter(x => {
                    return res.primary[0].state_id === x.id;
                });
                const objSite = {
                    code: res.code,
                    full_name: res.full_name,
                    country: res.primary[0].listCountry.map(x => {
                        if (res.primary[0].country_code === x.cd) {
                            return x.name;
                        }
                    }),
                    name: res.primary[0].name,
                    address_line: res.primary[0].address_line,
                    address_line2: res.primary[0].address_line2,
                    city_name: res.primary[0].city_name,
                    state: state[0].name,
                    zip_code: res.primary[0].zip_code
                };

                this.site.push(objSite);
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
        this.site.splice(index, 1);
    }

    createCustomer() {
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
            params['company_child'] = [];
            params['company_child'] = this.company_child;

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

            if (this.generalForm.value.buyer_type ===  'CP') {
                delete params.first_name;
                delete params.last_name;
                delete params.pwd;
                delete params.pwd_cfrm;
                delete params.username;
                delete params.email;
            } else {
                params.pwd_cfrm = params.pwd;
                delete params.full_name;

            }

            const data = {
                data: JSON.stringify(params)
            };

            this.customerService.createCustomer(data).subscribe(
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
                    this.toastr.error(err.message);
                });
        }

    }

}
