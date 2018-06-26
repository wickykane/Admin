import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { PromotionService } from '../promotion.service';
import { ToastrService } from 'ngx-toastr';
import { PromotionModalContent } from '../modals/promotion.modal';


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
  constructor(private vRef: ViewContainerRef, private fb: FormBuilder, private promotionService: PromotionService, public toastr: ToastrService, private router: Router, private modalService: NgbModal) {
     
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
  open() {
    const modalRef = this.modalService.open(PromotionModalContent);
    modalRef.result.then(data => {
      console.log(data);
    });
    modalRef.componentInstance.name = 'World';
  }
  createBudget = function () {
    let params = this.generalForm.value;
    this.promotionService.postBudget(params).subscribe(res => {
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

}
