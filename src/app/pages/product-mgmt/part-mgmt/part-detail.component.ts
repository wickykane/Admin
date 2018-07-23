import { Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

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
    public url_image;
    public item_condition;
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
        this.url_image = `${environment.api_url}file/view?path=`;
        this.route.params.subscribe(params => this.getDetailPart(params.id));
        this.galleryOptions = [
            {
                width: '500px',
                height: '400px',
                thumbnailsOrder: 'row',
                'preview': false,
                'imageAnimation': 'slide',
                'imageArrows': false,
                'thumbnailsArrows': true,
            }
        ];
    }

    getDetailPart(id) {
        this.productService.getDetailPart(id).subscribe(res => {
            try {
                if (res.status) {
                    this.part = res.data.item;
                    this.item_condition = res.data.item_condition;
                    this.list.images = res.data.images;
                    this.list.images.map(item => {
                        item['small'] = this.url_image + item.large_img;
                        item['medium'] = this.url_image + item.origin_img;
                        item['big'] = this.url_image + item.thumb_img;
                    });
                }

            } catch (e) {
                console.log(e);
            }
        });
    }
}
