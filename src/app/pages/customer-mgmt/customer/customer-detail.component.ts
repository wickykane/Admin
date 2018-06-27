import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../customer.service';

//  modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressModalContent } from '../../../shared/modals/address.modal';
import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';
import { ItemModalContent } from '../../../shared/modals/item.modal';


import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';

@Component({
    selector: 'app-customer-detail',
    templateUrl: './customer-detail.component.html',
    styleUrls: ['./customer.component.scss'],
    animations: [routerTransition()]
})

export class CustomerDetailComponent implements OnInit {

    generalForm: FormGroup;
    primaryForm: FormGroup;
    billingForm: FormGroup;
    shippingForm: FormGroup;

    public users: any = [];
    public listFile: any = [];
    public addressList: any = [];
    public imageSelected: string;
    public listMaster = {};
    public idSupplier: string;
    public removedList: any = [];
    private primaryAddress = [];
    public ADDRESS_TYPE = {
        3: 'MAIN',
        2: 'SHIPPING',
        1: 'BILLING'
    };

    constructor(public fb: FormBuilder,
        public router: Router,
        public route: ActivatedRoute,
        public toastr: ToastrService,
        public vRef: ViewContainerRef,
        private customerService: CustomerService,
        private modalService: NgbModal) {
        this.generalForm = fb.group({
            'buyer_type': [null, Validators.required],
            'full_name': [null, Validators.required],
            'email': [null, Validators.required],
            //  'sale_price_id': [null],
            'phone': [null],
            'fax': [null],
            'website': [null],
            'credit_sts': [null, Validators.required],
            'line_of_credit': [null, Validators.required],
            'credit_reason': [null],
            'credit_used': [null]
        });

        this.primaryForm = fb.group({
            'label': [null],
            'email': [null],
            'tax_number': [null],
            'phone': [null],
            'address_line': [null, Validators.required],
            'country_code': [null, Validators.required],
            'state_id': [null],
            'city_name': [null, Validators.required],
            'zip_code': [null, Validators.required]
        });

        this.listMaster['creditStatus'] = [{ id: 1, name: 'Close' }, { id: 2, name: 'Open' }, { id: 3, name: 'Hold' }];
    }

    ngOnInit() {
        this.route.params.subscribe(params => this.getDetailSupplier(params.id));
        this.listMaster['customerType'] = [{
            id: 'RS',
            name: 'Repair Shop'
        }, {
            id: 'NU',
            name: 'Normal Customer'
        }];
        this.getListCountry();
        this.getListState();
        this.removedList.length = 0;
    }
    getListBuyerType() {
        this.customerService.getListBuyerType().subscribe(res => {
            try {
                this.listMaster['customerType'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }
    getSalePriceList() {
        this.customerService.getSalePriceList().subscribe(res => {
            try {
                this.listMaster['salePriceList'] = res.data;
                console.log(this.listMaster);
            } catch (e) {
                console.log(e);
            }
        });
    }

    //  data master country
    getListCountry() {
        this.customerService.getListCountry().subscribe(res => {
            try {
                this.listMaster['countries'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }
    //  action change country
    changeCountry(id, flag) {
        const params = {
            country: id
        };
        this.getStateByCountry(params, flag);
    }

    getStateByCountry(params, name) {
        this.customerService.getStateByCountry(params).subscribe(res => {
            try {
                this.listMaster[name] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getListState() {
        this.customerService.getListState().subscribe(res => {
            try {
                this.listMaster['states'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }
    //  action copy address

    addNewLine() {
        this.users.push({});
    }

    removeLine(index) {
        this.users.splice(index, 1);
    }

    onFileChange(event) {
        this.listFile = [];
        this.imageSelected = '';
        const reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            const files = event.target.files;
            this.listFile = [...files];
            for (const file of files) {
                reader.readAsDataURL(file);
                reader.onload = (e) => {
                    this.imageSelected = e.target['result'];
                };
            }

        }
    }

    mergeAddressList(data) {
        let addressList = [];

        if (data['shipping'].length > 0) {
            addressList = addressList.concat(data['shipping']);

        }
        if (data['billing'].length > 0) {
            addressList = addressList.concat(data['billing']);

        }

        //  add property isCheck to array
        addressList.map((addr) => {
            addr.isChecked = false;
            return addr;
        });
        return addressList;
    }

    addNewAddress() {
        const modalRef = this.modalService.open(AddressModalContent, { size: 'lg' });
        modalRef.result.then(res => {
            this.addressList.push(res);
        });
        modalRef.componentInstance.input = {};
        modalRef.componentInstance.state = true;
    }

    updateAddress(data, index) {
        const modalRef = this.modalService.open(AddressModalContent, { size: 'lg' });
        modalRef.result.then(res => {
            this.addressList[index] = res;
        },
            reason => { });
        modalRef.componentInstance.input = data;
        modalRef.componentInstance.state = false;
    }

    getDetailSupplier(id) {
        this.idSupplier = id;
        this.customerService.getDetailBuyer(this.idSupplier).subscribe(res => {
            try {
                this.generalForm.patchValue(res.data);
                this.primaryForm.patchValue(res.data['primary'][0]);
                this.imageSelected = res.data.img;
                //  this.users = res.data['user'];
                this.primaryAddress = res.data['primary'][0];
                this.changeCountry(res.data['primary'][0]['country_code'], 'states_primary');
                this.addressList = this.mergeAddressList(res.data);
            } catch (e) {

            }
        });
    }

    checkItemChecked(item) {
        if (item.isChecked) {
            this.removedList.push(item);
        } else {
            this.removedList = this.removedList.filter((obj) => {
                return obj.isChecked === true;
            });
        }
    }

    deleteAddr() {
        const modalRef = this.modalService.open(ConfirmModalContent);
        modalRef.result.then(yes => {
            if (yes) {
                const params = {
                    buyer_id: this.idSupplier,
                    address_ids: this.removedList.map(x => x.address_id)
                };
                this.customerService.deleteAddress(params).subscribe(res => {
                    try {
                        this.toastr.success(res.message);
                        this.addressList = this.addressList.filter((obj) => {
                            return obj.isChecked === false;
                        });
                        this.removedList.length = 0;
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
        });
        modalRef.componentInstance.message = 'Are you sure you want to delete ?';
    }

    actionUpdate(objAddress) {
        const data = {};
        data['shipping'] = [];
        data['billing'] = [];

        objAddress.forEach(item => {
            if (parseInt(item.type, 1) === 2) {
                data['shipping'].push(item);

            }
            if (parseInt(item.type, 1) === 1) {
                data['billing'].push(item);

            }
        });

        this.updateSupplier(data);
    }

    updateSupplier(array) {
        const params = {...this.generalForm.value};
        params['user'] = {...[], ...this.users};
        params['primary'] = [];
        params['primary'].push(this.primaryForm.value);
        params['billing'] = [];
        params['billing'] = array['billing'];
        params['shipping'] = [];
        params['shipping'] = array['shipping'];

        const data = {
            data: JSON.stringify(params),
            image: this.listFile[0] || null
        };

        this.customerService.updateBuyer(data, this.idSupplier).subscribe(
            res => {
                try {
                    setTimeout(() => {
                        this.router.navigate(['/customer/buyer']);
                    }, 2000);
                    this.toastr.success(res.message);
                } catch (e) {
                    console.log(e);
                }
            },
            err => {
                  this.toastr.error(err.message);
            });
    }
}
