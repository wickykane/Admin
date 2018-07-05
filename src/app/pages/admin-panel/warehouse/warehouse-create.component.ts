import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { routerTransition } from '../../../router.animations';

import { CommonService } from '../../../services/common.service';
import { WarehouseService } from './warehouse.service';

@Component({
    selector: 'app-warehouse-create',
    templateUrl: './warehouse-create.component.html',
    styleUrls: ['./warehouse.component.scss'],
    providers: [WarehouseService],
    animations: [routerTransition()]
})
export class WarehouseCreateComponent implements OnInit {
    generalForm: FormGroup;
    public listCountry: any = [];
    public listState: any = [];
    public country_code: any = '';
    public state_id: any = '';
    constructor(
        public fb: FormBuilder,
        private commonService: CommonService,
        private warehouseService: WarehouseService
    ) {
        this.generalForm = fb.group({
            name: [null, Validators.required],
            address_line: [null, Validators.required],
            city_name: [null, Validators.required],
            state_id: [null],
            zip_code: [null, Validators.required],
            telephone: [null, Validators.required],
            mobile_phone: [null, Validators.required],
            fax: [null, Validators.required]
        });
    }

    ngOnInit() {
        this.getListCountryAdmin();
    }

    changeCountry() {
        console.log('country:', this.country_code);

        const params = {
            country: this.country_code
        };
        this.commonService.getStateByCountry(params).subscribe(res => {
            try {
                this.listState = res.data;
            } catch (e) {}
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
}
