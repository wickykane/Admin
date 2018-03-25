import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { PromotionService } from "../promotion.service";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { PromotionModalContent } from '../modals/promotion.modal';


@Component({
  selector: 'app-promotion-campaign',
  templateUrl: './promotion-campaign.create.component.html',
  styleUrls: ['./promotion-campaign.component.scss']
})

export class PromotionCampaignCreateComponent implements OnInit {
  /**
   * Variable Declaration
   */
  public generalForm: FormGroup;
  public listMaster = {};
  public data = {};

  /**
   * Init Data
   */
  constructor(private vRef: ViewContainerRef, private fb: FormBuilder, private promotionService: PromotionService, public toastr: ToastsManager, private router: Router, private modalService: NgbModal) {
    this.toastr.setRootViewContainerRef(vRef);
    this.generalForm = fb.group({
      'code': [{ value: null, disabled: true }],
      'name': [null, Validators.required],
      'end_dt': [null],
      'start_dt': [null],
      'is_default': [false, Validators.required],
      'sts': [null, Validators.required],
      'based_on': [null, Validators.required],
      'promotion_budget_id': [null, Validators.required],
      'customer_segment_id': [null, Validators.required],

    });
  }

  ngOnInit() {
    this.getListStatus();
    this.getListBaseOn();
    this.getListBudget();
    this.getListCustomerSegment();
    this.getListPromotionLevel();
    this.getTypeProgram();
    
    this.data['programs'] = [];
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

  getListBaseOn() {
    this.promotionService.getListBaseOption().subscribe(res => {
      try {
        this.listMaster['baseOn'] = res.results;
      } catch (e) {
        console.log(e);
      }
    })
  }

  getListBudget() {
    this.promotionService.getListBudgetAll().subscribe(res => {
      try {
        this.listMaster['budget'] = res.results;
      } catch (e) {
        console.log(e);
      }
    })
  }

  getListCustomerSegment() {
    this.promotionService.getListAllSegment().subscribe(res => {
      try {
        this.listMaster['customerSegment'] = res.results;
      } catch (e) {
        console.log(e);
      }
    })
  }

  getListPromotionLevel() {
    this.promotionService.getListprogramLevel().subscribe(res => {
      try {
        this.listMaster['promotionLevel'] = res.results;
      } catch (e) {
        console.log(e);
      }
    })
  }

  getTypeProgram() {
    this.promotionService.getTypeProgram().subscribe(res => {
      try {
        this.listMaster['typeProgram'] = res.results;
      } catch (e) {
        console.log(e);
      }
    })
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
  }

  clickAdd() {
    this.data['programs'].push({ 'is_dsct': 0, 'is_acc_bal': 0, 'is_promo_goods': 0 });
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
