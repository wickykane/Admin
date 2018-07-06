import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { routerTransition } from '../../../router.animations';

import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';
import { WarehouseService } from './warehouse.service';

@Component({
    selector: 'app-warehouse-edit',
    templateUrl: './warehouse-edit.component.html',
    styleUrls: ['./warehouse.component.scss'],
    providers: [WarehouseService, ToastrService],
    animations: [routerTransition()]
})
export class WarehouseEditComponent implements OnInit {
    generalForm: FormGroup;
    contactForm: FormGroup;
    public idWarehouse: string;

    public listCountry: any = [];
    public listState: any = [];
    constructor(
        public fb: FormBuilder,
        public router: Router,
        public route: ActivatedRoute,
        public toastr: ToastrService,
        private commonService: CommonService,
        private warehouseService: WarehouseService
    ) {
        this.generalForm = fb.group({
            name: [null, Validators.required],
            address_line: [null, Validators.required],
            city_name: [null, Validators.required],
            country_code: [null, Validators.required],
            state_id: [null, Validators.required],
            zip_code: [null, Validators.required],
            telephone: [null, Validators.required],
            mobile_phone: [null, Validators.required],
            fax: [null, Validators.required]
        });

        this.contactForm = fb.group({
            name: [null],
            job: [null],
            emal: [null],
            phone: [null]
        });
    }

    ngOnInit() {
        this.getListCountryAdmin();
        this.route.params.subscribe(params =>
            this.getDetailWarehouse(params.id)
        );
    }

    getDetailWarehouse(id) {
        this.idWarehouse = id;
        this.warehouseService
            .getDetailWarehouse(this.idWarehouse)
            .subscribe(res => {
                try {
                    this.generalForm.patchValue(res.data);
                } catch (e) {}
            });
    }

    changeCountry() {
        console.log('country:', this.generalForm.value.country_code);

        const params = {
            country: this.generalForm.value.country_code
        };

        Object.keys(params).forEach(
            key =>
                (params[key] === null || params[key] === '') &&
                delete params[key]
        );
        this.commonService.getStateByCountry(params).subscribe(res => {
            try {
                this.listState = res.data;
            } catch (e) {}
        });
    }

    changeState() {
        console.log('changeState: ', this.generalForm.value);
        console.log('isValid: ', this.generalForm.valid);
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

    updateWarehouse() {
        if (this.generalForm.valid) {
            const params = {
                ...this.generalForm.value,
                ...this.contactForm.value
            };

            const data = {
                data: JSON.stringify(params)
            };

            this.warehouseService.updateWarehouse(data).subscribe(
                res => {
                    console.log(res);
                    try {
                        setTimeout(() => {
                            this.router.navigate(['/warehouse']);
                        }, 2000);
                        this.toastr.success(res.message);
                    } catch (e) {
                        console.log(e);
                    }
                },
                err => {
                    console.log(err);
                    this.toastr.error(err.message);
                }
            );
        }
    }
}
