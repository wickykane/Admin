import { Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    NgxGalleryAnimation,
    NgxGalleryImage,
    NgxGalleryOptions
} from 'ngx-gallery';
import { ProductService } from '../product-mgmt.service';
import { PartKeyService } from './keys.control';

@Component({
    selector: 'app-part-edit',
    templateUrl: './part-edit.component.html',
    styleUrls: ['./part-list.component.scss'],
    providers: [PartKeyService]
})
export class PartEditComponent implements OnInit {
    /**
     * Variable Declaration
     */
    public generalForm: FormGroup;
    public part: any;
    public list = {
        image_del: [],
        files: []
    };
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];

    constructor(
        private fb: FormBuilder,
        public router: Router,
        public route: ActivatedRoute,
        public itemKeyService: PartKeyService,
        private productService: ProductService
    ) {
        this.generalForm = fb.group({
            is_quotable: [null],
            is_show_price: [null],
            sell_price: [null]
        });
        //  Init Key
        this.itemKeyService.watchContext.next(this);
    }

    ngOnInit() {
        this.part = {};
        this.route.params.subscribe(params => this.getDetailPart(params.id));
        this.galleryOptions = [
            {
                width: '500px',
                height: '400px',
                thumbnailsOrder: 'row'
            }
        ];
    }
    uploadFile($event) {
        const fileUpload: File = $event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(fileUpload);
        reader.onloadend = () => {
            const base64 = reader.result;
            const newImage = {
                small: base64,
                medium: base64,
                big: base64
            };

            this.galleryImages.push(newImage);
            this.list.files.push(reader.result);
        };
    }

    updateItem() {
        const data = {
            ...this.generalForm.value,
            ...this.list.files
        };
        Object.keys(data).forEach(
            key => (data[key] === null || data[key] === '') && delete data[key]
        );
        console.log(data);
        this.route.params.subscribe(params =>
            this.productService.updateItem(params.id, data).subscribe(res => {
                try {
                    console.log(res);
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
                    this.part = res.data.item;
                    // this.list.images = res.data.images;
                    this.generalForm.patchValue(res.data.item);
                }

                console.log(this.part);
                this.galleryImages = [
                    {
                        small:
                            'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-small.jpeg',
                        medium:
                            'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-medium.jpeg',
                        big:
                            'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-big.jpeg'
                    },
                    {
                        small:
                            'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/5-small.jpeg',
                        medium:
                            'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/5-medium.jpeg',
                        big:
                            'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/5-big.jpeg'
                    }
                ];
            } catch (e) {
                console.log(e);
            }
        });
    }
}
