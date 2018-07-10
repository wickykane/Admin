import { Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

    public listMaster = {};
    public list = {
        items: []
    };

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
        //  Init Fn
        this.listMaster['certification_partNumber'] = [
            { code: 'Y', value: 'Yes' },
            { code: 'N', value: 'No' }
        ];
        this.route.params.subscribe(params =>
            this.getDetailPart(params.id)
        );
    }

    getDetailPart(id) {
        const params = {};

        this.list.items = [
            {
                id: 1,
                sku: 'abc',
                partlinks_no: 'abc',
                des: 'abc',
                mfr_name: 'abc',
                model_name: 'abc',
                category_id: 'abc',
                sub_category_id: 'abc',
                brand_name: 'abc',
                cert: 'Y',
                UOM: 'abc',
                oem_price: 50,
                cost_price: 50,
                sell_price: 50
            }
        ];

        this.productService.getDetailPart(id).subscribe(res => {
            try {
                if (!res.data.rows) {
                    this.list.items = [];
                    return;
                }
                this.list.items = res.data.rows;

                this.listMaster['brands'] = res.data.meta_filters.brands;
                this.listMaster['categories'] =
                    res.data.meta_filters.categories;
                this.listMaster['certification'] =
                    res.data.meta_filters.certification;
                this.listMaster['countries'] = res.data.meta_filters.countries;
                this.listMaster['partlinks_no'] =
                    res.data.meta_filters.partlinks_no;
                this.listMaster['part_no'] = res.data.meta_filters.part_no;
                this.listMaster['manufacturers'] =
                    res.data.meta_filters.manufacturers;
            } catch (e) {
                console.log(e);
            }
        });
    }
}
