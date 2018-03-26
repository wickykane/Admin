import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { PromotionService } from "../promotion.service";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { PromotionModalContent } from '../modals/promotion.modal';
import { PromotionInvoiceModalContent } from '../modals/promotion-invoice.modal';


@Component({
  selector: 'app-promotion-campaign',
  templateUrl: './promotion-campaign.edit.component.html',
  styleUrls: ['./promotion-campaign.component.scss']
})

export class PromotionCampaignEditComponent implements OnInit {
  /**
   * Variable Declaration
   */
  public generalForm: FormGroup;
  public listMaster = {};
  public data = {};

  /**
   * Init Data
   */
  constructor(private vRef: ViewContainerRef, private fb: FormBuilder, private promotionService: PromotionService, public toastr: ToastsManager, private router: Router, private modalService: NgbModal, private route: ActivatedRoute) {
    this.toastr.setRootViewContainerRef(vRef);
    this.generalForm = fb.group({
      'cd': [{ value: null, disabled: true }],
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

    this.data["id"] = this.route.snapshot.paramMap.get('id');
    this.getDetailCampaign(this.data["id"]);
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
    return new Promise(resolve => {
      this.promotionService.getTypeProgram().subscribe(res => {
        try {
          this.listMaster['typeProgram'] = res.results;
          resolve(true);
        } catch (e) {
          console.log(e);
        }
      })
    })
  }
  /**
   * Internal Function
   */

  async getDetailCampaign(id) {
    this.getListStatus();
    this.getListBaseOn();
    this.getListBudget();
    this.getListCustomerSegment();
    this.getListPromotionLevel();
    await this.getTypeProgram();

    this.promotionService.getPromoProgram(id).subscribe(res => {
      try {
        if (res._type == 'success') {
          this.generalForm.patchValue(res.results);
          this.data['programs'] = res.results.programs || [];
          if (this.listMaster['typeProgram']) {
            this.data['programs'].forEach(item => {
              this.checkLevel(item, 1);
            });
          }
        } else {
          this.toastr.error(res.message);
        }

      } catch (e) {
        console.log(e)
      }
    })
  }


  checkLevel(item, flag?) {
    let tempArr = Array.from(this.listMaster['typeProgram']);
    if (item.level == 3) {
      item.typeProgram = tempArr.splice(1, 1);
      item.detail =   item.detail ||  [];
    } else {
      item.typeProgram = tempArr.splice(0, 1);
      item.detail =   item.detail || [];
    }

    //reset
    if(!flag) {
      item.is_promo_goods = false;
      item.is_dsct = false;
      item.is_acc_bal = false;
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

  openPromotionModal(item) {
    const modalRef = (item.level == 3 && item.type == 2) ? this.modalService.open(PromotionInvoiceModalContent, { size: 'sm' }) : this.modalService.open(PromotionModalContent, { size: 'lg' });
    modalRef.result.then(data => {
      console.log("Add data: ", data);
    });
    modalRef.componentInstance.item = item;
  }

  //Promo Program
  goPromoDetail = function (item) {
    if (!item.level || !item.type) return;
    this.openPromotionModal(item);
  }

  updateCampain = function () {
    var params = this.generalForm.value;
    params.programs = this.data['programs'];

    this.promotionService.updatePromoProgram(this.data['id'], params).subscribe(res => {
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
