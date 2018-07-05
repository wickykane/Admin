import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { TableService } from './../../../services/table.service';

// Services
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DiscountCategoryService } from './discount-category.service';



@Component({
    selector: 'app-discount-category-create',
    templateUrl: './discount-category.create.component.html',
    providers: [DiscountCategoryService],
    styleUrls: ['./discount-category.component.scss'],
    animations: [routerTransition()]
})
export class DiscountCategoryCreateComponent implements OnInit {
    /*
    // Variable Declaration
    */
    public generalForm: FormGroup;
    public listMaster = {};
    public data = {};

    /**
     * Init Data
     */
    constructor(private vRef: ViewContainerRef, private fb: FormBuilder, private discountCategoryService: DiscountCategoryService, public toastr: ToastrService, private router: Router) {

        this.generalForm = fb.group({
            'code': [null],
            'name': [null],
            'sts': [null],
            'start_dt': [null],
            'create_by': 'Khiet Pham',
            'create_dt': new Date().toLocaleDateString()
        });
    }

    ngOnInit() {
        this.data['products'] = [];
        this.getListStatus();
    }
    /**
     * Mater Data
     */
    getListStatus() {
        this.listMaster['status'] = [{
            code: '0',
            name: 'In-Active'
        }, {
            code: '1',
            name: 'Active '
        }];
    }

    /**
     * Internal Function
     */
    clickAdd() {
        this.data['products'].push({});
    }

    removeRow(index) {
        this.data['products'].splice(index, 1);
    }


    // Product Line

    createBundle() {
        const params = this.generalForm.value;
        params.detail = this.data['products'];
        this.discountCategoryService.getListWarehouse(params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                setTimeout(() => {
                    this.router.navigate(['/product-management/bundle']);
                }, 500);
            } catch (e) {
                console.log(e);
            }
        },
            err => {
                this.toastr.error(err);
            });

    }
}
