import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { OrderService } from "../order-mgmt.service";
import { ProductService } from "../../product-mgmt/product-mgmt.service";

import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-sale-price-create',
    templateUrl: './sale-price-create.component.html',
    styleUrls: ['./sale-price.component.scss'],
    providers: [OrderService,ProductService]

})

export class SalePriceCreateComponent implements OnInit {
    /**
     * Variable Declaration
     */
    public generalForm: FormGroup;
    public listMaster = {};
    public data = {};
    public all_customer_type = '1';
    /**
     * Init Data
     */
    constructor(private vRef: ViewContainerRef, private fb: FormBuilder, private orderService: OrderService,private productService:ProductService, public toastr: ToastrService, private router: Router, private modalService: NgbModal) {
         
        this.generalForm = fb.group({
            'cd': [{ value: null, disabled: true }],
            'des': [null],
            'sts': [null, Validators.required],
            'start_dt': [null, Validators.required],
            'end_dt': [null, Validators.required]            
        });
    }

    ngOnInit() {
        this.getListItemOption();
        this.data['products'] = [];
        //Master Data
        this.listMaster['status'] = [
            {
                id: '0',
                name: "In-Active"
            }, {
                id: '1',
                name: "Active "
            }
        ];
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

   
    createSalePrice = function () {
        let params = this.generalForm.value;
        params.products = Array.from( this.data.products);

        this.orderService.createSalePrice(params).subscribe(res => {
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
