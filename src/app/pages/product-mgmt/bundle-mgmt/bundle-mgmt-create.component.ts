import { TableService } from './../../../services/table.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from "../product-mgmt.service";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-bundle-mgmt-create',
  templateUrl: './bundle-mgmt-create.component.html'
  
})
export class BundleMgmtCreateComponent implements OnInit { 
   /**
   * Variable Declaration
   */
  public generalForm: FormGroup;
  public listMaster = {};
  public data = {};

  /**
   * Init Data
   */
  constructor(private vRef: ViewContainerRef, private fb: FormBuilder, private productService: ProductService, public toastr: ToastsManager, private router: Router) {
    this.toastr.setRootViewContainerRef(vRef);
    this.generalForm = fb.group({
      'code': [{ value: null, disabled: true }],
      'name': [null, Validators.required],      
      'sts': [null, Validators.required],
      'sale_price': [null, Validators.required],
      'cost_price': [null, Validators.required]   
    });
  }

  ngOnInit() {
    this.getListStatus();  
    this.data['products'] = [];
  }
  /**
   * Mater Data
   */
  getListStatus() {
    this.listMaster['status'] = [{
      id: '0',
      name: "In-Active"
    }, {
      id: '1',
      name: "Active "
    }];
  } 
  
  /**
   * Internal Function
   */

  checkLevel(item) {
    let tempArr = Array.from(this.listMaster['typeProgram']);
    if (item.level == 3) {
      item.typeProgram = tempArr.splice(1, 1);
      item.detail = [];
    } else {
      item.typeProgram = tempArr.splice(0, 1);
      item.detail = [];
    }

    //reset
    item.is_promo_goods = false;
    item.is_dsct = false;
    item.is_acc_bal = false;
  }

  clickAdd() {
    console.log('1');
    this.data['products'].push({});
  };

  toDateObject(date) {
    if (!date) return null;
    const dateObject = new Date(date);
    return {
      day: dateObject.getDate(),
      month: dateObject.getMonth() + 1,
      year: dateObject.getFullYear()
    }
  }
  //Promo Program
  goPromoDetail = function (item) {
    if (!item.level || !item.type) return;
    this.openPromotionModal(item);
  }

  createCampain = function () {
    var params = this.generalForm.value;
    params.programs = this.data['programs'];
    console.log(params);
    this.promotionService.postCampaign(params).subscribe(res => {
      try {
        this.toastr.success(res.message);
        setTimeout(() => {
          this.router.navigate(['/promotion/campaign']);
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
