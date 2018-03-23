import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PromotionService } from "../promotion.service";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


@Component({
  selector: 'app-promotion-budget',
  templateUrl: './promotion-budget.create.component.html',
  styleUrls: ['./promotion-budget.component.scss']
})

export class PromotionBudgetCreateComponent implements OnInit {
  /**
   * Variable Declaration
   */
  public generalForm: FormGroup;
  public listMaster = {};
  public data = {};

  /**
   * Init Data
   */
  constructor(private vRef: ViewContainerRef, private fb: FormBuilder, private promotionService: PromotionService, public toastr: ToastsManager, private router: Router) {
    this.toastr.setRootViewContainerRef(vRef);
    this.generalForm = fb.group({
      'code': [{ value: null, disabled: true }],
      'name': [null, Validators.required],
      'allowable_qty': [null],
      'allowable_amt': [null],
      'crtd_on': [new Date(), Validators.required],
    });
  }

  ngOnInit() {

  }

  /**
   * Internal Function
   */
  createBudget = function () {
    let params = this.generalForm.value;
    this.promotionService.postBudget(params).subscribe(res => {
      try {
        if (res._type == 'success') {
          this.toastr.success(res.message);
          setTimeout(() => {
            this.router.navigate(['/promotion/budget']);
          }, 500)

        } else {
          this.toastr.error(res.message);
        }

      } catch (e) {
        console.log(e)
      }
    })


  }

}
