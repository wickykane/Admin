import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { OrderService } from '../order-mgmt.service';
import { ProductService } from '../../product-mgmt/product-mgmt.service';

import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-sale-price-edit',
    templateUrl: './sale-price-edit.component.html',
    styleUrls: ['./sale-price.component.scss'],
    providers: [OrderService, ProductService]

})

export class SalePriceEditComponent implements OnInit {
     /**
     * Variable Declaration
     */
    public generalForm: FormGroup;
    public listMaster = {};
    public data = {};    
    /**
     * Init Data
     */
    constructor(private vRef: ViewContainerRef, private fb: FormBuilder, private orderService: OrderService,private productService:ProductService, public toastr: ToastrService, private router: Router, private modalService: NgbModal,private route: ActivatedRoute) {
         
        this.generalForm = fb.group({
            'cd': [{ value: null, disabled: true }],
            'des': [null],
            'sts': [null, Validators.required],
            'start_dt': [null, Validators.required],
            'end_dt': [null, Validators.required]            
        });
    }

    ngOnInit() {
       
        this.data['products'] = [];
        // Master Data
        this.listMaster['status'] = [
            {
                id: '0',
                name: 'In-Active'
            }, {
                id: '1',
                name: 'Active '
            }
        ];
        this.data['id'] = this.route.snapshot.paramMap.get('id');
        this.getDetailSalesPrice(this.data['id']);
    }
    getDetailSalesPrice(id) {
        this.getListItemOption();
        this.orderService.getDetailSalePrice(id).subscribe(res => {
            try {
                if (res._type ===  'success') {
                    this.generalForm.patchValue(res.results);
                    this.data['products'] = res.results.products || [];
                    this.data['products'].forEach((data, index) => {
                        this.changeProductLine(data, index);
                    });

                } else {
                    this.toastr.error(res.message);
                }

            } catch (e) {
                console.log(e)
            }
        })

    }
    getListItemOption(){
        this.productService.getListItemOption().subscribe(res=>{
          this.listMaster['listProduct'] = res.results;     
        })
      }

    /**
     * Internal Function
     */
    clickAdd = function () {
        this.data.products.push({ });
    };

    remove = function (index) {
        this.data.products.splice(index, 1);
    };    

    changeProductLine(item,index){
        let itemID = this.listMaster['listProduct'].filter(product=>{
          if(product.item_id==item.wine_id)
            return product;
        })
        item.name= itemID[0].name;
        item.uom_name=itemID[0].uom_name;
        item.price=itemID[0].price;
        item.resale_price =itemID[0].resale_price;
      }

   
    updateSalePrice = function () {
        let params = this.generalForm.value;
        params.products = Array.from( this.data.products);

        this.orderService.updateSalePrice(this.data['id'],params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                setTimeout(() => {
                    this.router.navigate(['/order-management/sales-price']);
                }, 500)
            } catch (e) {
                console.log(e)
            }
        },
            err => {
                  this.toastr.error(err.message);
            })
    }
}
