import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { TableService } from './../../../services/table.service';

// Services
import { Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import * as _ from 'lodash';
import { DiscountCategoryService } from './discount-category.service';



@Component({
    selector: 'app-discount-category-edit',
    templateUrl: './discount-category.edit.component.html',
    providers: [DiscountCategoryService],
    styleUrls: ['./discount-category-create.component.scss'],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountCategoryEditComponent implements OnInit {
    /*
    // Variable Declaration
    */
    public generalForm: FormGroup;
    public listMaster = {};
    public data = {};
    public flagAddress: boolean;
    public listCheckType = [];
    public masterTypeArr = [];
    public id = '';

    public listCheckSubCat = [];

    /**
     * Init Data
     */
    constructor(private vRef: ViewContainerRef,
        private cd: ChangeDetectorRef,
        private fb: FormBuilder,
        private discountCategoryService: DiscountCategoryService,
        public toastr: ToastrService,
        private router: Router,
        public route: ActivatedRoute) {

        this.generalForm = fb.group({
            'code': [null],
            'description': [null],
            'ac': [null],
        });
    }

    ngOnInit() {
        this.data['products'] = [];
        this.getListStatus();
        this.getListReference();
        this.route.params.subscribe(params =>
            setTimeout(() => {
                this.id = params.id;
                this.getDetailDiscountCategory(params.id);
            }, 1000)
        );
    }
    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }
    /**
     * Mater Data
     */
    getDetailDiscountCategory(id) {
        this.discountCategoryService.getDetailDiscountCategory(id).subscribe(
            res => {
                this.generalForm.patchValue(res.data.info);
                this.data['products'] = [...res.data.category];
                this.data['products'].length > 0 ? this.flagAddress = true : this.flagAddress = false;
                this.data['products'].forEach(e => {
                    (async () => {
                        await new Promise((calback) => { this.changeCategory(e.category_id, e, true); });
                    })();
                });
                this.refresh();
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
                this.refresh();
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
                item.listType = [];
                item.listType = [...item.listType, { id: 1, value: 'All', disabled: false }, { id: 2, value: 'Specific', disabled: false }];

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

        this.data['products'].map(obj => {
            if (item.category_id === obj.category_id) {
                item.listSubCategory = [...obj.listSubCategory];
                obj.listSubCategory = [...item.listSubCategory];
            }
        });

    }

    changeCategory(id, item, flag) {
        if (id) {
            if (this.listCheckSubCat.indexOf(id) !== -1) {
                this.data['products'].map(obj => {
                    if (id === obj.category_id) {
                        item.listSubCategory = [...obj.listSubCategory];
                        obj.listSubCategory = [...item.listSubCategory];
                    }
                });
                this.listCheckType.map(obj => {
                    if (id === obj.category_id) {
                        item.listType = [...obj.listType];
                        obj.listType = [...item.listType];
                    }
                });

            } else {
                this.listCheckSubCat.push(id);
                this.getListSubCate(id, item);
                this.listCheckType.push(item);
            }
        }

        if (flag) {
          if (item.apply_for === 2) {
            item['sub_category_id'].forEach(e => {
                this.changeToGetSubCategory(e, item);
            });
          } else {
            this.mapArrayValue(item, true);
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
        item.listSubCategory.map(obj => {
            if (value.value.category_id === obj['category_id']) {
                obj['disabled'] = false;
            }
        });


    }


    // Product Line
    addNewLine() {
        this.data['products'].push({
            'category_id': '',
            'sub_category_id': [],
            'discount': 0,
            'apply_for': '',
            'listType': [],
            'listSubCategory': []
        });
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

    }

    // create new discount by category
    createDiscountCategory() {
        const params = this.generalForm.value;
        params.category_info = this.data['products'];
        this.discountCategoryService.updatelDiscountCategory(this.id, params).subscribe(res => {
            try {
                this.toastr.success('Update Discount Category Successfully');
                setTimeout(() => {
                    this.router.navigate(['/admin-panel/discount-category']);
                }, 500);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        },
            err => {
                this.toastr.error(err);
            });

    }
}
