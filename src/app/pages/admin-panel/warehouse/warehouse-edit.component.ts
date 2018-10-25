import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { routerTransition } from '../../../router.animations';

import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';
import { WarehouseService } from './warehouse.service';

import { WarehouseEditKeyService } from './edit-keys.control';

@Component({
    selector: 'app-warehouse-edit',
    templateUrl: './warehouse-edit.component.html',
    styleUrls: ['./warehouse.component.scss'],
    providers: [WarehouseService, ToastrService, WarehouseEditKeyService],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarehouseEditComponent implements OnInit {
    generalForm: FormGroup;
    contactForm: FormGroup;
    public idWarehouse: string;

    public listCountry: any = [];
    public listState: any = [];
    constructor(
        private cd: ChangeDetectorRef,
        public fb: FormBuilder,
        public router: Router,
        public route: ActivatedRoute,
        public toastr: ToastrService,
        private commonService: CommonService,
        private _hotkeysService: HotkeysService,
        public keyService: WarehouseEditKeyService,
        private warehouseService: WarehouseService
    ) {
        this.generalForm = fb.group({
            name: [null, Validators.required],
            addr: [null, Validators.required],
            city: [null, Validators.required],
            ctr: [null, Validators.required],
            st: [null, Validators.required],
            zip_cd: [null, Validators.required],
            ctt_phone: [null, Validators.required],
            mbl_phone: [null, Validators.required],
            fax_no: [null, Validators.required]
        });

        this.contactForm = fb.group({
            ctt_name: [null],
            job_title: [null],
            ctt_email: [null],
            ctt_phone: [null]
        });
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    ngOnInit() {
        this.getListCountryAdmin();
        this.route.params.subscribe(params =>
            this.getDetailWarehouse(params.id)
        );
    }

    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    getDetailWarehouse(id) {
        this.idWarehouse = id;
        this.warehouseService
            .getDetailWarehouse(this.idWarehouse)
            .subscribe(res => {
                try {
                    this.generalForm.patchValue(res.data);
                    this.contactForm.patchValue(res.data);
                    this.refresh();
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
                this.refresh();
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
                this.refresh();
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

            // this.warehouseService.updateWarehouse(data).subscribe(
            //     res => {
            //         console.log(res);
            //         try {
            //             setTimeout(() => {
            //                 this.router.navigate(['/warehouse']);
            //             }, 2000);
            //             this.refresh();
            //             this.toastr.success(res.message);
            //         } catch (e) {
            //             console.log(e);
            //         }
            //     },
            //     err => {
            //         console.log(err);
            //         this.toastr.error(err.message);
            //     }
            // );
        }
    }
}
