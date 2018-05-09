import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from "../customer.service";
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { CustomerKeyService } from "./keys.control";
import { TableService } from './../../../services/table.service';

@Component({
    selector: 'app-customer-view',
    templateUrl: './customer-view.component.html',
    styleUrls: ['./customer.component.scss'],
    animations: [routerTransition()],
    providers: [CustomerKeyService]
})

export class CustomerViewComponent implements OnInit {

    public customer = {};
    public listMaster = {};
    public searchFormQuote: FormGroup;
    public searchFormSO: FormGroup;


    constructor(
        public router: Router,
        public fb: FormBuilder,
        public tableService: TableService,
        public route: ActivatedRoute,
        public toastr: ToastrService,
        public customerKeyService: CustomerKeyService,
        private customerService: CustomerService) {
        this.searchFormQuote = fb.group({
            'buyer_name': [null],
            'email': [null],
            'buyer_type': [null],
            'from': [null],
            'to': [null],

        });
        this.searchFormSO = fb.group({
            'buyer_name': [null],
            'email': [null],
            'buyer_type': [null],
            'from': [null],
            'to': [null],

        });
        //Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;

        //Init Key
        this.customerKeyService.watchContext.next(this);
    }

    ngOnInit() {
        this.route.params.subscribe(params => this.getDetailSupplier(params.id));
        this.listMaster['addresses'] = [{}, {}, {}, {}, {}, {}];
    }

    getListBuyerType() {
        this.customerService.getListBuyerType().subscribe(res => {
            try {
                this.listMaster['customerType'] = res.data;
            } catch (e) {
                console.log(e);
            }
        })
    }

    getDetailSupplier(id) {
        // this.idSupplier = id;
        // this.customerService.getDetailBuyer(this.idSupplier).subscribe(res => {
        //     try {
        //         this.generalForm.patchValue(res.data);
        //         this.primaryForm.patchValue(res.data['primary'][0]);
        //         this.imageSelected = res.data.img;
        //         // this.users = res.data['user'];
        //         this.primaryAddress = res.data['primary'][0];
        //         this.changeCountry(res.data['primary'][0]['country_code'], 'states_primary');
        //         this.addressList = this.mergeAddressList(res.data);
        //     } catch (e) {

        //     }
        // })
    }

}
