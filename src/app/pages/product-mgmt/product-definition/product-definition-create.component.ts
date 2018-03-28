import {TableService} from './../../../services/table.service';
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Form, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from "../product-mgmt.service";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

@Component({selector: 'app-product-definition-create', templateUrl: './product-definition-create.component.html', styleUrls: ['../product-mgmt.component.scss']})
export class ProductDefinitionCreateComponent implements OnInit {
    /**
   * Variable Declaration
   */
    public generalForm : FormGroup;
    public listMaster = {};
    public data = {};
    public listPreview = [];

    /**
   * Init Data
   */
    constructor(private vRef : ViewContainerRef, private fb : FormBuilder, private productService : ProductService, public toastr : ToastsManager, private router : Router) {
        this
            .toastr
            .setRootViewContainerRef(vRef);
        this.generalForm = fb.group({
            'product_type': [],
            'name': [],
            'category_id': [],
            'price': [],
            'resale_price': [],
            'is_quotable': [],
            'supplier_id': [],
            'volumne': [],
            'year': [],
            'state_id': []
        });
    }

    ngOnInit() {
        this.getProductType();
        this.getGrapeVariety();
        this.getListBand();
    }
    /**
   * Mater Data
   */

    getProductType() {
        this
            .productService
            .getProductType()
            .subscribe(function (res) {
                try {
                    this.listMaster['productType'] = res.results;
                } catch (e) {
                    console.log(e.message);
                }
            });
    }
    getGrapeVariety() {
        this
            .productService
            .getGrapeVariety()
            .subscribe(function (res) {
                try {
                    this.listMaster['grapeVarieties'] = res.results;
                } catch (e) {
                    console.log(e.message);
                }
            });
    }
    changeProductType(id) {
        this
            .productService
            .getProductCategory(id)
            .subscribe(function (res) {
                try {
                    this.listMaster['productCategory'] = res.results;
                } catch (e) {
                    console.log(e.message);
                }
            });
    }
    getListBand() {
        this
            .productService
            .getListBand()
            .subscribe(function (res) {
                try {
                    this.listMaster['listBrand'] = res.data.results;
                } catch (e) {
                    console.log(e);
                }
            })
    }

    /**
   * Internal Function
   */

    toDateObject(date) {
        if (!date) 
            return null;
        const dateObject = new Date(date);
        return {
            day: dateObject.getDate(),
            month: dateObject.getMonth() + 1,
            year: dateObject.getFullYear()
        }
    }

    createBundle = function () {
        let params = this.generalForm.value;
        params.detail = this.data['products'];
        this
            .productService
            .postBundle(params)
            .subscribe(res => {
                try {
                    this
                        .toastr
                        .success(res.message);
                    setTimeout(() => {
                        this
                            .router
                            .navigate(['/product-management/bundle']);
                    }, 500)
                } catch (e) {
                    console.log(e);
                }
            }, err => {
                this
                    .toastr
                    .error(err);
            })

    }

}
