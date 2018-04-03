import {TableService} from './../../../services/table.service';
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Form, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from "../product-mgmt.service";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

@Component({selector: 'app-product-definition-create', templateUrl: './product-definition-create.component.html', styleUrls: ['../product-mgmt.component.scss']})
export class ProductDefinitionCreateComponent implements OnInit {
    /**
   * Variable Declaration
   */
    public generalForm : FormGroup;
    public listMaster = {};
    public data = {};
    public listPreview = [];
    public selectedImage=1;
    public wine_images=[];

    /**
   * Init Data
   */
    constructor(private vRef : ViewContainerRef, private fb : FormBuilder, private productService : ProductService, public toastr : ToastsManager, private router : Router) {
        this.toastr.setRootViewContainerRef(vRef);
        this.generalForm = fb.group({
            'product_type': [],
            'name': [],
            'category_id': [],
            'price': [],
            'resale_price': [],
            'is_quotable': [],
            'supplier_id': [],
            'volumne': [],
            'year': [],
            'state_id': [],
            'brand_id':[],
            'supp_prod_cd':[],
            'country_code':[],
            'grape_varieties':[],
            'alcohol':[]
        });
    }

    ngOnInit() {
        this.getProductType();
        this.getGrapeVariety();
        this.getListBand();
        this.getCountry();
        this.getListSupplier();
        this.listMaster['quotable']=[{id:0,name:'No'},{id:1,name:'Yes'}];
    }
    /**
   * Mater Data
   */

    getProductType() {
        this
            .productService
            .getProductType()
            .subscribe( (res) =>{                
                try {
                    this.listMaster['productType'] = res.results;                  
                } catch (e) {
                    console.log(e.message);
                }
            });
    }
    getGrapeVariety() {
        this
            .productService
            .getGrapeVariety()
            .subscribe( (res)=> {
                try {
                    this.listMaster['grapeVarieties'] = res.results;
                } catch (e) {
                    console.log(e.message);
                }
            });
    }
   
    getListBand() {
        this
            .productService
            .getListBand()
            .subscribe( (res)=> {
                try {
                    this.listMaster['listBrand'] = res.results;
                } catch (e) {
                    console.log(e);
                }
            })
    }
    getListSupplier(){
        this
            .productService
            .getListSupplier()
            .subscribe( (res)=> {
                try {
                    this.listMaster['supplier'] = res.results.rows;
                } catch (e) {
                    console.log(e);
                }
            })
    }
    getCountry(){
        this
        .productService
        .getCountry()
        .subscribe( (res)=> {
            try {
                this.listMaster['countries'] = res.results;
            } catch (e) {
                console.log(e);
            }
        })
    }
    changeProductType(id) {
        this
            .productService
            .getProductCategory(id)
            .subscribe( (res)=> {
                try {
                    this.listMaster['productCategory'] = res.results;
                } catch (e) {
                    console.log(e.message);
                }
            });
    }
    changeCountry() {
        let params = {
            country: this.generalForm.value.country_code
        };
        this.productService.getStateByCountry(params).subscribe((res)=> {
          try {
            this.listMaster['states'] = res.results;
          } catch (e) {
            console.log(e);
          }
        })
    }

    /**
   * Internal Function
   */
  selectedImages(id){
      console.log('abc');
  }
  setFiles (event) {
    this.selectedImage = 0;
    this.listPreview = [];
    this.wine_images = [];
    let files = event.target.files;
    this.wine_images = files;
    if(files.length>5) {
        alert('Maximum number of files is 5');
        return false;
    }
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var reader = new FileReader();
        reader.onload = (e) => {
            this.listPreview.push(e.target['result']);
        }
        reader.readAsDataURL(file);
    }
}

    toDateObject(date) {
        if (!date) 
            return null;
        const dateObject = new Date(date);
        return {
            day: dateObject.getDate(),
            month: dateObject.getMonth() + 1,
            year: dateObject.getFullYear()
        }
    }

    createProduct = function () {
        let params = this.generalForm.value;
        console.log(params);
        let data = {
            data: JSON.stringify(params),           
        }
        for(let i =0; i<this.wine_images.length; i++){            
            data['image'+(i+1)] = this.wine_images[i];
        }     
       
        console.log(data);
        this
            .productService
            .postProductDefinition(data)
            .subscribe(res => {
                try {
                    this
                        .toastr
                        .success(res.message);
                    setTimeout(() => {
                        this
                            .router
                            .navigate(['/product-management/bundle']);
                    }, 500)
                } catch (e) {
                    console.log(e);
                }
            }, err => {
                this
                    .toastr
                    .error(err);
            })

    }

}
