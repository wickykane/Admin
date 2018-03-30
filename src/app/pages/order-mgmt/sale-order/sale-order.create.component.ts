import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { OrderService } from "../order-mgmt.service";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ToastrService } from 'ngx-toastr';

import { ItemModalContent } from "../../../shared/modals/item.modal";
import { PromotionModalContent } from "../../../shared/modals/promotion.modal";



@Component({
  selector: 'app-create-order',
  templateUrl: './sale-order.create.component.html',
  styleUrls: ['./sale-order.component.scss']
})

export class SaleOrderCreateComponent implements OnInit {
  /**
   * Variable Declaration
   */
  public generalForm: FormGroup;
  public listMaster = {};
  public selectedIndex = 0;
  public data = {};
  public order = {
    information: {},
    address: { primary: [{}], billing: [{}] }
  }
  public bill = {};
  public ship = {};

  public order_info = {
    total: 0,
    sub_total: 0,
    order_date: '',
    customer_po: '',
    total_discount: 0,
    company_id: null,
    selected_programs: [],
    discount_percent: 0,
    vat_percent: 0,
    shipping_cost: 0
  };

  public list = {
    items: [],
    backItems: []
  };
  public payment;
  public promotionList = {};

  /**
   * Init Data
   */
  constructor(private vRef: ViewContainerRef, private fb: FormBuilder, public toastr: ToastrService, private router: Router, private modalService: NgbModal, private orderService: OrderService) {
    this.generalForm = fb.group({
      'customer_po': [null, Validators.required],
      'order_number': [null],
      'type': [null, Validators.required],
      'order_date': [null, Validators.required],
      'delivery_date': [null],
      // 'buyer_type': [null, Validators.required],
      // 'company_id': [null, Validators.required],
      // 'payment_method': [null],
      // 'payment_term': [null],
      // 'payment_due_date': [null],
    });
  }

  ngOnInit() {
    this.listMaster['payType'] = [{ id: 'PKU', name: "Pickup " }, { id: 'CE', name: "Call" }, { id: 'ONL', name: "Ecommerce" }, { id: 'NO', name: "Normal Order" }];
    this.payment = {
      paymentMethod: [
        { id: 'AB', name: "Account Balance" },
        { id: 'BT', name: "Bank Transfer" },
        { id: 'CS', name: "Cash" },
        { id: 'CC', name: "Credit Card" }
      ],
      paymentTerm: [
        { id: 15, name: "15 days" },
        { id: 30, name: "30 days" }
      ]
    }
    this.getBuyerType();
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

  getBuyerType() {
    this.orderService.getBuyerType().subscribe(res => {
      try {
        this.listMaster['buyerType'] = res.results;
      } catch (e) {
        console.log(e);
      }
    })
  }

  getListCompanySearch(type_buyer) {
    this.orderService.getListCompany(type_buyer).subscribe(res => {
      try {
        this.listMaster['listCompanySearch'] = res.results.rows;
      } catch (e) {
        console.log(e);
      }
    })
  }

  /**
   * Internal Function
   */
  selectData(data) { }

  resetPromo() {
    this.promotionList = [];
    this.list.items.forEach(function (item) {
      item.promotion_discount_amount = 0;
    });
  }

  updateTotal() {
    this.order_info.total = 0;
    this.order_info.sub_total = 0;
    if (this.list.items != undefined) {
      this.list.items.forEach((item) => {
        var sub_quantity = 0;
        item.discount_percent = item.discount_percent != undefined ? item.discount_percent : 0;
        item.products.forEach((subItem, index) => {
          if (item.products.length > 0) {
            sub_quantity += Number(subItem.quantity);
          }
        });

        var value = (Number(item.resale_price) * (Number(item.quantity) + sub_quantity) - (Number(item.resale_price) * (Number(item.quantity) + sub_quantity)) * Number(item.discount_percent) / 100) - (item.promotion_discount_amount ? item.promotion_discount_amount : 0);

        item.totalItem = value;

        if (value) {
          this.order_info.sub_total = this.order_info.sub_total + value;
        }
      });

    }
    this.order_info['shipping_cost'] = (this.order_info['shipping_cost'] != undefined ? this.order_info['shipping_cost'] : 0);
    this.order_info['alt_vat_percent'] = (this.order_info['vat_percent'] != undefined ? this.order_info['vat_percent'] : 0);
    this.order_info['alt_discount_percent'] = (this.order_info['discount_percent'] != undefined ? this.order_info['discount_percent'] : 0);
    this.promotionList['total_invoice_discount'] = (this.promotionList['total_invoice_discount'] ? this.promotionList['total_invoice_discount'] : 0);

    this.order_info.total_discount = parseFloat((this.order_info.sub_total * Number(this.order_info['alt_discount_percent']) / 100).toFixed(2))
    this.order_info['vat_percent_amount'] = parseFloat((this.order_info.sub_total * Number(this.order_info['alt_vat_percent']) / 100).toFixed(2));
    this.order_info.total = this.order_info.sub_total + Number(this.order_info['shipping_cost']) + this.order_info['vat_percent_amount'] - this.order_info.total_discount - this.promotionList['total_invoice_discount'];
  }

  calcPromotion(company_id) {
    this.orderService.getActiveProgram(company_id).subscribe(res => {
      try {
        this.checkListPromotion(res.results);
      } catch (e) {
        console.log(e);
      }
    })
  }

  checkListPromotion(data) {
    const modalRef = this.modalService.open(PromotionModalContent, { size: 'lg' });
    modalRef.result.then(res => {
      if ((res) instanceof Array && res.length > 0) {
        this.order_info.selected_programs = res;
        var params = {};
        params['company_id'] = this.order_info.company_id;
        params['selected_programs'] = this.order_info.selected_programs;
        params['items'] = this.list.items;
        this.orderService.previewOrder(params).subscribe(res => {
          try {
            this.promotionList = res.results.promotion;
            this.list.items = res.results.items;
          } catch (e) {
            console.log(e.message);
          }
        });
      }
    });
    modalRef.componentInstance.data = data;
  }

  selectCompany(id) {
    if (id) {
      this.orderService.getDetailCompany(id).subscribe(res => {
        try {
          this.order = res.results;
          if (this.list.items.length > 0) {
            for (var i = 0; i < this.list.items.length; i++) {
              this.list.items[i]['shipping_address_id'] =
                this.order.address['shipping'][0].id;
            }
          }
        } catch (e) {
          console.log(e);
        }
      })
    }
  }

  selectAddress(id, type) {
    try {
      switch (type) {
        case 'shipping':
          this.ship = this.findDataById(id, this.order.address['shipping']);
          break;
        case 'billing':
          this.bill = this.findDataById(id, this.order.address['billing']);
          break;
      }
    } catch (e) {
      console.log(e);
    }
  }

  findDataById(id, arr) {
    var result;
    if ((arr) instanceof Array) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
          result = arr[i];
          break;
        }
      }
    }
    return result;
  }

  resetPaymentMethod() {
    this.order_info['payment_term'] = null;
    this.order_info['payment_due_date'] = null;
  }

  clickAdd() {
    this.data['programs'].push({ 'is_dsct': 0, 'is_acc_bal': 0, 'is_promo_goods': 0 });
  };

  addNewItem(list, type_get, buyer_id) {
    const modalRef = this.modalService.open(ItemModalContent, { size: 'lg' });
    modalRef.result.then(res => {
      if (res instanceof Array && res.length > 0) {
        var listAdded = [];
        (this.list.items).forEach(function (item) {
          listAdded.push(item.item_id);
        });
        res.forEach(function (item) {
          if (item.resale_price) item.resale_price = Number(item.resale_price);
          item['products'] = [];
          item.quantity = 1;
          item.totalItem = item.resale_price;
        })

        this.list.items = this.list.items.concat(res.filter(function (item) {
          return listAdded.indexOf(item.item_id) < 0;
        }));

        this.updateTotal();
      }
    });
    modalRef.componentInstance.flagBundle = true;
  }

  //Promo Program
  goPromoDetail = function (item) {
    if (!item.level || !item.type) return;
    this.openPromotionModal(item);
  }

  remove = function (index) {
    this.data['programs'].splice(index, 1);
  };


  createOrder() {

    var products = [];
    this.list.items.forEach(function (item) {
      products.push({
        item_id: item.item_id,
        quantity: item.order_quantity,
        price: item.sell_price,
        discount_percent: item.discount,
        shipping_address_id: item.shipping_address_id,
        warehouse_id: item.warehouse_id || 1
      });
    });

    let params = {
      "brand_id": 1,
      "billing_id": this.bill['id'],
      "selected_programs": this.order_info.selected_programs,
      "items": this.list.items
    };

    params = Object.assign({}, this.order_info, params, this.generalForm.value);

    this.orderService.createOrder(params).subscribe(res => {
      try {
        if (res.results.status) {
          this.toastr.success(res.results.message);
          setTimeout(() => {
            this.router.navigate(['/order-management/sale-order']);
          }, 500)
        }
        else {
          this.toastr.error(res.results.message, null, { enableHtml: true });
        }
      } catch (e) {
        console.log(e);
      }
    },
      err => {
        this.toastr.error(err.message, null, { enableHtml: true });
      })
  }

}
