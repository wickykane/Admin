import { Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NguCarousel } from '@ngu/carousel';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { routerTransition } from '../../../router.animations';

import {
    NgxGalleryAnimation,
    NgxGalleryImage,
    NgxGalleryOptions,
} from 'ngx-gallery';

import { ProductService } from '../product-mgmt.service';
import { PartKeyService } from './keys.control';

@Component({
    selector: 'app-part-detail',
    templateUrl: './part-detail.component.html',
    styleUrls: ['./part-list.component.scss'],
    providers: [PartKeyService],
    animations: [routerTransition()]
})
export class PartDetailComponent implements OnInit {
    /**
     * Variable Declaration
     */
    public listMaster = {};
    public generalForm: FormGroup;
    public part = {
        part_no: '',
        make_name: '',
        partlinks_no: '',
        des: '',
        yr_from: '',
        yr_to: '',
        brand_name: '',
        model_name: '',
        ctgry_name: '',
        sub_ctgry_name: '',
        cert_name: '',
        len: '',
        width: '',
        height: '',
        vol: '',
        wt: '',
        cost_price: '',
        oem_price: '',
        uom_name: '',
    };
    public images: any = [];
    public dataFile: any = [];
    public url_image;
    public list = {
        image_del: []
    };
    public item_condition;
    galleryOptions: NgxGalleryOptions[];

    public detail = {
        short_des: '',
        full_des: '',
        category_discounts: { discount: '' }
    };
    public ckeConfig = {
        height: 90,
        language: 'en',
        allowedContent: true,
        toolbar: [
            { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
            { name: 'justify', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] }
        ]
    };

    constructor(
        private fb: FormBuilder,
        public router: Router,
        public route: ActivatedRoute,
        public itemKeyService: PartKeyService,
        private productService: ProductService,
        public toastr: ToastrService
    ) {
        this.generalForm = fb.group({
            is_quotable: [null],
            is_show_price: [null],
            sell_price: [null, Validators.required],
            freight_class: [{ disabled: true }, Validators.required],
            is_taxable: [null, Validators.required],
            inventory_account_id: [null, Validators.required],
            income_account_id: [null, Validators.required],
            expense_account_id: [null, Validators.required],
            short_des: [null],
            full_des: [null],
            free_ship: [null, Validators.required],
            ups: [null, Validators.required]
        });
        //  Init Key
        this.listMaster['account'] = [];

        this.itemKeyService.watchContext.next(this);
        this.getAccountType();

    }

    ngOnInit() {
        this.listMaster['listQuestion'] = [{ id: 0, name: 'No' }, { id: 1, name: 'Yes' }];
        this.url_image = `${environment.api_url}file/view?path=`;
        this.route.params.subscribe(params => this.getDetailPart(params.id));
        this.galleryOptions = [
            {
                width: '500px',
                height: '400px',
                thumbnailsOrder: 'row',
                'preview': false,
                'imageAnimation': 'slide',
                'thumbnailsArrows': true,
                thumbnailActions: [{ icon: 'black fa fa-times-circle', onClick: this.deleteImage.bind(this), titleText: 'Delete' }]
            }
        ];
    }


    getAccountType() {
        this.productService.getAccountType().subscribe(
            res => {
                try {
                    this.listMaster['account'] = res.data;

                } catch (e) {
                    console.log(e);
                }
            },
            err => { }
        );
    }

    deleteImage(event, index) {
        this.dataFile.splice(index - this.images.length, 1);
        if (this.images[index]['item_image_id']) {
            this.list.image_del.push(this.images[index]['item_image_id']);
        }
        this.images.splice(index, 1);
    }

    uploadFile($event) {
        const fileUpload = $event.target.files;
        console.log(fileUpload.length);
        if (fileUpload.length <= 5) {
            this.dataFile = Array.from(fileUpload);
            for (const file of fileUpload) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const base64 = reader.result;
                    const galleryImage = {
                        small: base64,
                        medium: base64,
                        big: base64
                    };
                    this.images.push(galleryImage);
                };
            }
        } else {
            this.toastr.error('The maximum image upload is 5 !');
        }


    }

    updateItem() {
        this.generalForm.patchValue({ short_des: this.detail.short_des });
        this.generalForm.patchValue({ full_des: this.detail.full_des });
        const formData = new FormData();
        formData.append('data', JSON.stringify(this.generalForm.value));
        for (const file of this.dataFile) {
            formData.append('files[]', file);
        }
        formData.append('image_del', JSON.stringify(this.list.image_del));

        this.route.params.subscribe(params =>
            this.productService.updateItem(params.id, formData).subscribe(res => {
                try {
                    if (res.status) {
                        this.toastr.success(res.message);
                        this.router.navigate(['/product-management/part-list']);
                    }
                } catch (e) {
                    console.log(e);
                }
            })
        );
    }

    getDetailPart(id) {
        this.productService.getDetailPart(id).subscribe(res => {
            try {
                if (res.status) {
                    this.part = res.data.item ? res.data.item : this.part;
                    this.detail.short_des = res.data.item ?  res.data.item.short_des : null;
                    this.detail.full_des = res.data.item ? res.data.item.full_des : null;
                    this.detail.category_discounts = res.data.category_discounts;
                    this.listMaster['freight_class'] = res.data.freight_class;
                    this.images = res.data.images;
                    this.item_condition = res.data.item_condition;
                    this.images.map(item => {
                        item['small'] = this.url_image + item.large_img;
                        item['medium'] = this.url_image + item.origin_img;
                        item['big'] = this.url_image + item.thumb_img;
                        item['item_image_id'] = item.item_image_id;
                    });
                    this.generalForm.patchValue(res.data.item);
                }
            } catch (e) {
                console.log(e);
            }
        });
    }
}
