import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PromotionService } from "../promotion.service";

@Component({
  selector: 'promotion-modal-content',
  templateUrl: './promotion-invoice.modal.html'
})
export class PromotionInvoiceModalContent implements OnInit {
  //Resolve Data
  @Input() name;
  @Input() item;

  public modalTitle = 'PROMOTION DETAIL LINE';
  public listMaster = {};
  private _item;
  constructor(public activeModal: NgbActiveModal, private promotionService: PromotionService) { }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getListPromotionLevel();
    this.getListItem();
    this.getListPromoType();
    this._item = Object.assign(this.item);
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

  /**
   * Internal Fn
   */

  clickAdd = function () {
    console.log(this.item)
    this.item.detail.push({ level: this.item.level, prom_type: 1 });
  };

  remove = function (index) {
    this.item.detail.splice(index, 1);
  };

  cancel() {
    this.item = this._item;
    this.activeModal.close(this.item);
  }

  changeProductLineBuying = function (item, index) {
    var itemID = this.listMaster.productList.filter(function (product) {
      if (product.item_id == item.buying_product_id)
        return product;
    });
    item.name = itemID[0].name;
    item.uom = itemID[0].uom_name;
    item.price = itemID[0].price;
  }

  changeProductLinePromo = function (item, index) {
    var itemID = this.listMaster.productList.filter(function (product) {
      if (product.item_id == item.prom_product_id)
        return product;
    });
    item.prom_name = itemID[0].name;
    item.prom_uom = itemID[0].uom_name;
    item.price = itemID[0].price;
  }

}
