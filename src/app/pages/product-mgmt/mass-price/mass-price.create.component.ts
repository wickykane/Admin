import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product-mgmt.service';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';

@Component({
    selector: 'app-mass-price-create',
    templateUrl: './mass-price.create.component.html',
    styleUrls: ['./mass-price.component.scss'],
    animations: [routerTransition()]
})
export class MassPriceCreateComponent implements OnInit {
    /**
     * Variable Declaration
     */
    public generalForm: FormGroup;
    public listMaster = {};
    public data = {};
    public items: any = [];
    public listFile: any = [];

    /**
     * Init Data
     */
    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        private productService: ProductService) {
        this.generalForm = fb.group({
            'name': [null, Validators.required],
            'path': [null]
        });
    }

    ngOnInit() {
    }
    /**
     * Mater Data
     */

    /**
     * Internal Function
     */
    onFileChange(event) {
        this.listFile = [];
        const reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            const files = event.target.files;
            this.listFile = Array.of(...files);
            this.generalForm.patchValue({ path: this.generalForm.value.name });
        }
    }

    importFile() {

        const data = {
            file: this.listFile[0]
        };
        this.productService.postFileMassPrice(data).subscribe(
            res => {
                try {
                    this.toastr.success('The file has been imported successfully');
                    setTimeout(() => {
                        this.router.navigate(['/product-management/mass-price/detail/' + res.data.id]);
                    }, 1000);
                } catch (e) {
                    console.log(e);
                }
            }, err => {
                this.toastr.error(err);
            });
    }


}
