import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PromotionService } from "../promotion.service";
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-promotion-budget',
  templateUrl: './promotion-budget.edit.component.html',
  styleUrls: ['./promotion-budget.component.scss']
})

export class PromotionBudgetEditComponent implements OnInit {
  /**
   * Variable Declaration
   */
  public generalForm: FormGroup;
  public listMaster = {};
  public data = {};

  /**
   * Init Data
   */
  constructor(private vRef: ViewContainerRef, private fb: FormBuilder, private promotionService: PromotionService, public toastr: ToastrService, private router: Router, private route: ActivatedRoute) {
     
    this.generalForm = fb.group({
      'cd': [null],
      'name': [null, Validators.required],
      'allowable_qty': [null],
      'allowable_amt': [null],
      'crtd_on': [new Date(), Validators.required],
      'tot_qty_used': [null],
      'tot_amt_used': [null],
      'rest_qty': [null],
      'rest_amount': [null],


    });
  }

  ngOnInit() {
    this.data["id"] = this.route.snapshot.paramMap.get('id');
    this.getDetailBudget(this.data["id"]);
  }

  /**
   * Internal Function
   */

  getDetailBudget(id) {
    this.promotionService.getBudgetDetail(id).subscribe(res => {
      try {
        if (res._type == 'success') {
          this.generalForm.patchValue(res.results);
        } else {
          this.toastr.error(res.message);
        }

      } catch (e) {
        console.log(e)
      }
    })
  }

  updateBudget = function () {
    let params = this.generalForm.value;
    this.promotionService.updateBudget(this.data['id'], params).subscribe(res => {
      try {

        this.toastr.success(res.message);
        setTimeout(() => {
          this.router.navigate(['/promotion/budget']);
        }, 500)
      } catch (e) {
        console.log(e)
      }
    },
      err => {
        this.toastr.error(err.message, null, {enableHTML: true});        
      })
  }

  approveBudget = function () {
    let params = this.generalForm.value;
    this.promotionService.approveBudget(this.data['id'], params).subscribe(res => {
      try {
        if (res._type == 'success') {
          this.toastr.success(res.message);
        } else {
          this.toastr.error(res.message);
        }
      } catch (e) {
        console.log(e)
      }
    })
  }

}
