import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product-mgmt.service';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';

@Component({
    selector: 'app-mass-price-view',
    templateUrl: './mass-price.view.component.html',
    styleUrls: ['./mass-price.component.scss'],
    animations: [routerTransition()]
})
export class MassPriceViewComponent implements OnInit {
    /**
     * Variable Declaration
     */
    public generalForm: FormGroup;
    public listMaster = {};
    public data = {};
    public items: any = [];
    public listFile: any = [];

    /**
     * Init Data
     */
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        private productService: ProductService) {

    }

    ngOnInit() {
      this.route.params.subscribe(params =>
          this.getDetailMassPrice(params.id)
      );
    }
    /**
     * Mater Data
     */

    /**
     * Internal Function
     */
    getDetailMassPrice(id) {
      this.productService.getDetailMassPrice(id).subscribe(res => {
              try {
                  console.log(res);
              } catch (e) {}
          });
    }


}
