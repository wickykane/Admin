import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PromotionService } from "../promotion.service";

@Component({
  selector: 'promotion-modal-content',
  templateUrl: './promotion.modal.html'
})
export class PromotionModalContent {
  //Resolve Data
  @Input() name;
  public modalTitle = 'PROMOTION DETAIL LINE';
  public listMaster = {};

  constructor(public activeModal: NgbActiveModal, private promotionService: PromotionService) { }

  getListPromotionLevel() {
    this.promotionService.getListprogramLevel().subscribe(res => {

      try {
        this.listMaster['promotionLevel'] = res.results;
      } catch (e) {
        console.log(e);
      }
    })
  }

  getListItem() {
    this.promotionService.getListItemOption().subscribe(res => {

      try {
        this.listMaster['productList'] = res.results;
      } catch (e) {
        console.log(e);
      }
    })
  }

  getListPromoType() {
    this.promotionService.getListPromoType().subscribe(res => {

      try {
        this.listMaster['promoType'] = res.results;
      } catch (e) {
        console.log(e);
      }
    })
  }

}
