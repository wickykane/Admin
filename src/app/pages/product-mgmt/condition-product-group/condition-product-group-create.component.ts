import { TableService } from './../../../services/table.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product-mgmt.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-condition-group-create',
  templateUrl: './condition-product-group-create.component.html'
  
})
export class ConditionProductGroupCreateComponent implements OnInit { 
   /**
   * Variable Declaration
   */
  public generalForm: FormGroup;
  public listMaster = {};
  public data = {};

  /**
   * Init Data
   */
  constructor(private vRef: ViewContainerRef, private fb: FormBuilder, private productService: ProductService, public toastr: ToastrService, private router: Router) {
     
    this.generalForm = fb.group({      
      'name': [null, Validators.required],      
      'sts': [null, Validators.required]      
    });
  }

  ngOnInit() {
    this.getListStatus();  
    this.getListItemOption();
    this.data['products'] = [];
  }
  /**
   * Mater Data
   */
  getListStatus() {
    this.listMaster['status'] = [{
      id: '0',
      name: 'In-Active'
    }, {
      id: '1',
      name: 'Active '
    }];
  } 
  
  /**
   * Internal Function
   */
  getListItemOption(){
    this.productService.getListItemOption().subscribe(res=>{
      this.listMaster['listProduct'] = res.results;     
    })
  }

  checkLevel(item) {
    let tempArr = Array.from(this.listMaster['typeProgram']);
    if (item.level === 3) {
      item.typeProgram = tempArr.splice(1, 1);
      item.detail = [];
    } else {
      item.typeProgram = tempArr.splice(0, 1);
      item.detail = [];
    }

    // reset
    item.is_promo_goods = false;
    item.is_dsct = false;
    item.is_acc_bal = false;
  }

  clickAdd() {    
    this.data['products'].push({limit_type:'Quantity'});
  };
  removeRow(index) {
    this.data['products'].splice(index,1);
  }

  toDateObject(date) {
    if (!date) return null;
    const dateObject = new Date(date);
    return {
      day: dateObject.getDate(),
      month: dateObject.getMonth() + 1,
      year: dateObject.getFullYear()
    }
  }
  // Product Line  
  changeProductLine(item,index){
    let itemID = this.listMaster['listProduct'].filter(product=>{
      if(product.item_id==item.wine_id)
        return product;
    })
    item.name= itemID[0].name;
    item.uom_name=itemID[0].uom_name;
    item.price=itemID[0].price;
  }

  createProductGroup = function () {
    let params = this.generalForm.value;
    params.detail  = this.data['products'];   
    this.productService.postCondition(params).subscribe(res => {
      try {
        this.toastr.success(res.message);
        setTimeout(() => {
          this.router.navigate(['/product-management/condition-product']);
        }, 500)
      } catch (e) {
        console.log(e);
      }
    },
      err => {
        this.toastr.error(err);
      })

  }

}
