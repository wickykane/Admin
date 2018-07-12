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
    public flagSub = false;

    public listCheckSubCat = [];

    /**
     * Init Data
     */
    constructor(private vRef: ViewContainerRef, private fb: FormBuilder, private discountCategoryService: DiscountCategoryService, public toastr: ToastrService, private router: Router) {

        this.generalForm = fb.group({
            'code': [null],
            'description': [null],
            'ac': [null],
            'start_date': [null],
            'create_by': 'Khiet Pham',
            'create_dt': new Date().toLocaleDateString()
        });
    }

    ngOnInit() {
        this.data['products'] = [];
        this.getListStatus();
        this.getListReference();
        this.generateCode();
    }
    /**
     * Mater Data
     */
    generateCode() {
        this.discountCategoryService.generateCode().subscribe(
            res => {
                this.generalForm.patchValue({ code: res.message });
            },
            err => {

            });
    }

    getListReference() {
        this.discountCategoryService.getListCategory().subscribe(
            res => {
                this.listMaster['category'] = res.data.categories;
                this.listMaster['type'] = res.data.apply_for;
                this.initDisabledType(res.data.categories);
            },
            err => {

            });
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
        this.listMaster['category'].map(obj => {
            if (id === obj.category_id) {
                item.listSubCategory = obj['sub_categories'];
                this.initDisabledType(item.listSubCategory);

                if (item.listSubCategory.length <= 0) {
                  item['apply_for'] = 1;
                  this.flagSub = true;
                } else {
                  this.flagSub = false;
                }
            }
        });
    }


    /**
     * Internal Function
     */

    initDisabledType(array) {
        array.map(obj => {
            obj['disabled'] = false;
        });
    }

    mapArrayValue(item, flag) {
        this.listMaster['category'].map(obj => {
            if (obj.category_id === item.category_id) {
                obj['disabled'] = flag;
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
            item.sub_category_id.map(res => {
                if (res === obj['category_id']) {
                    obj['disabled'] = flag;
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
        if (id === 1) {
            this.mapArrayValue(item, true);
        }
    }

    changeToGetSubCategory(sub_category_id, item) {

        this.switchStatusSelected(item, true);
        console.log(item.listSubCategory.every(this.isSameAnswer));
        this.mapArrayValue(item, item.listSubCategory.every(this.isSameAnswer) ? true : false);
    }

    removeSelected(value: any, sub_category_id, item) {
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
    createDiscountCategory() {
        const params = this.generalForm.value;
        params.category_info = this.data['products'];
        this.discountCategoryService.createDiscountCategory(params).subscribe(res => {
            try {
                this.toastr.success('Create Discount Category Successfully');
                setTimeout(() => {
                    this.router.navigate(['/admin-panel/discount-category']);
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
