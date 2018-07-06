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
    public flagAddress: boolean;

    public listCheckSubCat = [];

    public tempCat = [{ id: 1, name: 'A', disabled: false }, { id: 2, name: 'B', disabled: false }];

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
        this.getListCategory();
        this.getListType();
    }
    /**
     * Mater Data
     */
    getListType() {
        this.listMaster['type'] = [{ id: 'A', name: 'All' }, { id: 'S', name: 'Specific' }];
    }

    getListCategory() {
        this.listMaster['category'] = this.tempCat;
        // this.discountCategoryService.getListCategory().subscribe(
        //     res => {
        //
        //     },
        //     err => {
        //
        //     });
    }

    getListStatus() {
        this.listMaster['status'] = [{
            code: '0',
            name: 'In-Active'
        }, {
            code: '1',
            name: 'Active '
        }];
    }

    getListSubCate(id, item) {
        switch (id) {
            case 1:
                item.listSubCategory = [{ id: 1, name: 'a', disabled: false }, { id: 2, name: 'b', disabled: false }, { id: 3, name: 'c', disabled: false }];
                break;
            case 2:
                item.listSubCategory = [{ id: 1, name: 'd', disabled: false }, { id: 2, name: 'e', disabled: false }, { id: 3, name: 'f', disabled: false }];
                break;

        }

        // this.discountCategoryService.getListSubCategoryByCategory(id).subscribe(
        //     res => {
        //
        //     },
        //     err => {
        //
        //     });
    }

    /**
     * Internal Function
     */
    mapArrayValue(item, flag) {
        this.listMaster['category'].map(obj => {
            if (obj.id === item.category_id) {
                obj.disabled = flag;
            }
        });
    }

    isSameAnswer(currentValue, index, arr) {
        if (index === 0) {
            return true;
        } else {
            return (currentValue.disabled === arr[index - 1].disabled);
        }
    }

    switchStatusSelected(item, flag) {
        item.listSubCategory.map(obj => {
            item.sub_cate_id.map(res => {
                if (res === obj['id']) {
                    obj.disabled = flag;
                }
            });
        });
    }

    changeCategory(id, item) {
        if (id) {
            if (this.listCheckSubCat.indexOf(id) !== -1) {
                this.data['products'].map(obj => {
                    if (id === obj.category_id) {
                        item.listSubCategory = obj.listSubCategory;
                    }
                });

            } else {
                this.listCheckSubCat.push(id);
                this.getListSubCate(id, item);
            }
        }

    }


    changeType(id, item) {
        if (id === 'A') {
            this.mapArrayValue(item, true);
        }
    }

    changeToGetSubCategory(sub_cate_id, item) {

        this.switchStatusSelected(item, true);
        this.mapArrayValue(item, item.listSubCategory.every(this.isSameAnswer) ? true : false);
    }

    removeSelected(value: any, sub_cate_id, item) {
        item.listSubCategory.map(obj => {
            if (value.value.id === obj['id']) {
                obj.disabled = false;
            }
        });
        this.mapArrayValue(item, item.listSubCategory.every(this.isSameAnswer) ? true : false);

    }


    // Product Line
    addNewLine() {
        this.data['products'].push({});
    }

    removeLine(index, item) {
        this.data['products'].splice(index, 1);
        this.mapArrayValue(item, false);
        this.switchStatusSelected(item, false);

    }

    // create new discount by category
    createCategory() {
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
