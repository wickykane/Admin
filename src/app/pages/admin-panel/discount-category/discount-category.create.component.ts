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
    public listCheckType = [];
    public masterTypeArr = [];
    // public flagSub = false;

    public listCheckSubCat = [];

    /**
     * Init Data
     */
    constructor(private vRef: ViewContainerRef, private fb: FormBuilder, private discountCategoryService: DiscountCategoryService, public toastr: ToastrService, private router: Router) {

        this.generalForm = fb.group({
            'code': [null],
            'description': [null],
            'ac': [null, Validators.required],
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
                this.masterTypeArr = Array.of(...res.data.apply_for);
                this.initDisabledType(this.listMaster['category']);
                this.initDisabledType(this.masterTypeArr);
            },
            err => {

            });
    }

    getListStatus() {
        this.listMaster['status'] = [{
            code: 0,
            name: 'In-Active'
        }, {
            code: 1,
            name: 'Active '
        }];
    }

    getListSubCate(id, item) {
        this.listMaster['category'].map(obj => {
            if (id === obj.category_id) {
                item.listSubCategory = obj['sub_categories'];
                this.initDisabledType(item.listSubCategory);
                item.listType = [{ id: 1, value: 'All', disabled: false }, { id: 2, value: 'Specific', disabled: false }];

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
        item.listType[0]['disabled'] = true;

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
                this.listCheckType.map(obj => {
                    if (id === obj.category_id) {
                        item.listType = obj.listType;
                    }
                });

            } else {
                this.listCheckSubCat.push(id);
                this.getListSubCate(id, item);
                this.listCheckType.push(item);
            }
        }
    }


    changeType(id, item) {
        if (id === 1) {
            this.listMaster['category'].map(obj => {
                if (obj.category_id === item.category_id) {
                    obj['disabled'] = true;
                }
            });
        }
    }

    changeToGetSubCategory(sub_category_id, item) {
        this.switchStatusSelected(item, true);
        this.mapArrayValue(item, item.listSubCategory.every(this.isSameAnswer) ? true : false);
    }

    removeSelected(value: any, sub_category_id, item) {
      console.log(value);
      console.log(item);
        item.listSubCategory.map(obj => {
            if (value.value.category_id === obj['category_id']) {
                obj['disabled'] = false;
            }
        });


    }


    // Product Line
    addNewLine() {
        this.data['products'].push({});
    }

    isEmptyObject(obj) {
        return (obj && (Object.keys(obj).length === 0));
    }

    removeLine(index, item) {
        if (!this.isEmptyObject(item)) {
            if (item.apply_for === 1) {
                this.listMaster['category'].map(obj => {
                    if (obj.category_id === item.category_id) {
                        obj['disabled'] = false;
                    }
                });
                this.data['products'].splice(index, 1);
                const i = this.listCheckSubCat.indexOf(item.category_id);
                this.listCheckSubCat.splice(i, 1);
                this.listCheckType.splice(index, 1);
            } else {
                this.listMaster['category'].map(obj => {
                    if (obj.category_id === item.category_id) {
                        obj['disabled'] = false;
                    }
                });

                item.listSubCategory.map(res => {
                    item.sub_category_id.map(x => {
                        if (x === res.category_id) {
                            res['disabled'] = false;
                        }
                    });
                });
                this.data['products'].splice(index, 1);

              if (item.listSubCategory.every(this.isSameAnswer)) {
                this.data['products'].splice(index, 1);
                const i = this.listCheckSubCat.indexOf(item.category_id);
                this.listCheckSubCat.splice(i, 1);
                this.listCheckType.splice(index, 1);
                item = {};
              }
            }
        } else {
            this.data['products'].splice(index, 1);

        }
        console.log(this.data['products']);
        console.log(item);
        console.log(this.listCheckSubCat);
        console.log(this.listCheckType);

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
