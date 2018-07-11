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
    selector: 'app-part-detail',
    templateUrl: './part-detail.component.html',
    styleUrls: ['./part-list.component.scss'],
    providers: [PartKeyService]
})
export class PartDetailComponent implements OnInit {
    /**
     * Variable Declaration
     */
    public part: any;
    public list = {
        images: []
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
                thumbnailsOrder: 'row',
                // thumbnailsColumns: 4,
                // thumbnailsRows: 1
            }
        ];
    }

    getDetailPart(id) {
        this.productService.getDetailPart(id).subscribe(res => {
            try {
                if (res.status) {
                    this.part = res.data.item;
                    this.list.images = res.data.images;
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
                            'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/2-small.jpeg',
                        medium:
                            'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/2-medium.jpeg',
                        big:
                            'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/2-big.jpeg'
                    },
                    {
                        small:
                            'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-small.jpeg',
                        medium:
                            'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-medium.jpeg',
                        big:
                            'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-big.jpeg'
                    },
                    {
                        small:
                            'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/4-small.jpeg',
                        medium:
                            'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/4-medium.jpeg',
                        big:
                            'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/4-big.jpeg'
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
