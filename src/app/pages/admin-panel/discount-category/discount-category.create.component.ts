import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';

// Services
import { Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HotkeysService } from 'angular2-hotkeys';
import * as _ from 'lodash';
import { StorageService } from '../../../services/storage.service';
import { DiscountCategoryService } from './discount-category.service';
import { DiscountCategoryCreateKeyService } from './keys.create.control';



@Component({
    selector: 'app-discount-category-create',
    templateUrl: './discount-category.create.component.html',
    providers: [DiscountCategoryService, DiscountCategoryCreateKeyService],
    styleUrls: ['./discount-category-create.component.scss'],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountCategoryCreateComponent implements OnInit {
    /*
    // Variable Declaration
    */
    public generalForm: FormGroup;
    public listMaster = {};
    public data = {};
    public flagAddress = true;
    public listCheckType = [];
    public masterTypeArr = [];
    // public flagSub = false;

    public listCheckSubCat = [];

    /**
     * Init Data
     */
    constructor(private vRef: ViewContainerRef,
        private fb: FormBuilder,
        private discountCategoryService: DiscountCategoryService,
        public toastr: ToastrService,
        private router: Router,
        private _hotkeysService: HotkeysService,
        public keyService: DiscountCategoryCreateKeyService,
        private storage: StorageService,
        private cd: ChangeDetectorRef) {

        this.generalForm = fb.group({
            'code': [null],
            'description': [null],
            'ac': [null, Validators.required],
            'start_date': [null],
            'create_by': 'Khiet Pham',
            'create_dt': new Date().toLocaleDateString()
        });
         //  Init Key
         this.listMaster['permission'] = this.storage.getRoutePermission(this.router.url);
         this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    ngOnInit() {
        this.data['products'] = [];
        this.getListStatus();
        this.getListReference();
        this.generateCode();
        this.addNewLine();
    }
    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }
    /**
     * Mater Data
     */
    generateCode() {
        this.discountCategoryService.generateCode().subscribe(
            res => {
                this.generalForm.patchValue({ code: res.message });
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

    changeCategory(id, item) {
      console.log(item);
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
    }


    changeType(id, item) {
        if (id === 1) {
            this.listMaster['category'].map(obj => {
                if (obj.category_id === item.category_id) {
                    obj['disabled'] = true;
                }
            });
            item['sub_category_id'] = [];
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

        this.data['products'].map(obj => {
            if (item.category_id === obj.category_id) {
                item.listSubCategory = [...obj.listSubCategory];
                obj.listSubCategory = [...item.listSubCategory];
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
        this.discountCategoryService.createDiscountCategory(params).subscribe(res => {
            try {
                this.toastr.success('Create Discount Category Successfully');
                setTimeout(() => {
                    this.router.navigate(['/admin-panel/discount-category']);
                }, 500);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });

    }
    reback() {
        this.router.navigate(['/admin-panel/discount-category/']);
    }
}
