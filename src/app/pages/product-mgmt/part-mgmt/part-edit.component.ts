import { Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NguCarousel } from '@ngu/carousel';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';

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
    public carouselImages: NguCarousel;
    public generalForm: FormGroup;
    public part: any;
    public images: any = [];
    public dataFile: any = [];
    public url_image;
    public list = {
        image_del: []
    };
    public item_condition;
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];

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
            sell_price: [null]
        });
        //  Init Key
        this.itemKeyService.watchContext.next(this);
    }

    ngOnInit() {
        this.url_image = `${environment.api_url}file/view?path=`;
        this.part = {};
        this.route.params.subscribe(params => this.getDetailPart(params.id));
        this.galleryOptions = [
            {
                width: '500px',
                height: '400px',
                thumbnailsOrder: 'row'
            }
        ];
        this.carouselImages = {
            grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
            slide: 1,
            speed: 400,
            interval: 4000,
            point: {
                visible: true
            },
            load: 2,
            touch: true,
            loop: true,
            custom: 'banner'
        };
    }
    uploadFile($event) {
        console.log($event);
        const fileUpload: File = $event.target.files;
        console.log(fileUpload);
        this.dataFile = fileUpload;
        // const reader = new FileReader();
        // reader.readAsDataURL(fileUpload);
        // reader.onloadend = () => {
        //     const base64 = reader.result;
        //     const galleryImage = {
        //         small: base64,
        //         medium: base64,
        //         big: base64
        //     };
        //     this.galleryImages.push(galleryImage);

        //     const nguImage = {
        //         origin_img: base64
        //     };
        //     this.images.push(nguImage);
        //     this.list.files.push(reader.result);
        // };
    }

    updateItem() {
        const  formData = new FormData();
        console.log(this.generalForm.value);
        formData.append('data', JSON.stringify(this.generalForm.value));
        for ( const file of this.dataFile) {
            formData.append('files[]', file);
        }
        formData.append('image_del', JSON.stringify(this.list.image_del));
        this.route.params.subscribe(params =>
            this.productService.updateItem(params.id, formData ).subscribe(res => {
                try {
                    if (res.status) {
                        console.log(res.message);
                        this.toastr.success(res.message);
                    }
                } catch (e) {
                    console.log(e);
                }
            })
        );
    }

    removeItem(index, item) {
        this.images.splice(index, 1);
        this.list.image_del.push(item.item_image_id);
    }

    getDetailPart(id) {
        this.productService.getDetailPart(id).subscribe(res => {
            try {
                if (res.status) {
                    this.part = res.data.item;
                    this.images = res.data.images;
                    this.item_condition = res.data.item_condition;
                    // this.images
                    this.generalForm.patchValue(res.data.item);
                }

                console.log(res.data);
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

    myfunc(event: Event) {
        // carouselLoad will trigger this funnction when your load value reaches
        // it is helps to load the data by parts to increase the performance of the app
        // must use feature to all carousel
    }
}
