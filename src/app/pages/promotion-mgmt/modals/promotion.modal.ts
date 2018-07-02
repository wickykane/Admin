import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PromotionService } from '../promotion.service';

@Component({
  selector: 'promotion-modal-content',
  templateUrl: './promotion.modal.html'
})
export class PromotionModalContent implements OnInit {
  // Resolve Data
  @Input() name;
  @Input() item;

  public modalTitle = 'PROMOTION DETAIL LINE';
  public listMaster = {};

  constructor(public activeModal: NgbActiveModal, private promotionService: PromotionService) { }

  ngOnInit() {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.getListPromotionLevel();
    this.getListPromoType();
    if ((this.item.level === 2 || this.item.level === 4) && this.item.type === 1) {
      if (this.item.level === 4) {
        // List Condition
        this.getListLine();
        this.getListConditionRef();
      } else {
        // List Bundle
        this.getListBundleRefer();
      }
    }
    else {
      // List Item Line
      this.getListItem();
    }
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

  getListConditionRef() {
    this.promotionService.getListConditionRef().subscribe(res => {
      try {
        this.listMaster['productList'] = res.results;
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

  getListLine() {
    this.promotionService.getListItemOption().subscribe(res => {

      try {
        this.listMaster['productLine'] = res.results;
      } catch (e) {
        console.log(e);
      }
    })
  }

  // Bundle
  getListBundleRefer() {
    this.promotionService.getListRefernceBundle().subscribe(res => {

      try {
        this.listMaster['productListBundle'] = res.results;
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
    this.activeModal.close(this.item);
  }

  changeProductLineBuying = function (item, index) {
    var itemID = this.listMaster.productList.filter(function (product) {
      if (product.item_id === item.buying_product_id)
        return product;
    });
    item.name = itemID[0].name;
    item.uom = itemID[0].uom_name;
    item.price = itemID[0].price;
  }

  changeProductLinePromo = function (item, index) {
    var itemID = this.listMaster.productList.filter(function (product) {
      if (product.item_id === item.prom_product_id)
        return product;
    });
    item.prom_name = itemID[0].name;
    item.prom_uom = itemID[0].uom_name;
    item.price = itemID[0].price;
  }

  changeBundleLineBuying = function (item, index) {
    var itemID = this.listMaster.productListBundle.filter(function (product) {
      if (product.item_id === item.buying_bundle_id)
        return product;
    });
    console.log(itemID);
    item.name = itemID[0].name;
    item.uom = itemID[0].uom_name;
    item.price = itemID[0].price;
  }

  changeBundleLinePromo = function (item, index) {
    var itemID = this.listMaster.productListBundle.filter(function (product) {
      if (product.item_id === item.prom_bundle_id)
        return product;
    });
    item.prom_name = itemID[0].name;
    item.prom_uom = itemID[0].uom_name;
    item.prom_price = itemID[0].price;
  }

  changeConditionLineBuying = function (item, index) {
    var itemID = this.listMaster.productList.filter(function (product) {
      if (product.id === item.promotion_condition_group_id)
        return product;
    });
    item.name = itemID[0].name;
  }

}
