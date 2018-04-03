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
    primary: [{}],
    billing: []
  }
  public bill = {};
  public billing = null;
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
  constructor(private vRef: ViewContainerRef, private fb: FormBuilder, public toastr: ToastrService, private router: Router, private route: ActivatedRoute, private modalService: NgbModal, private orderService: OrderService) {
    this.generalForm = fb.group({
      'customer_po': [null, Validators.required],
      'order_number': [null],
      'type': [null, Validators.required],
      'order_date': [null, Validators.required],
      'delivery_date': [null],
    });
  }

  ngOnInit() {


    this.listMaster['buyerType'] = [{ id: 'NU', label: 'Normal Customer' }, { id: 'RS', label: 'Repair Shop' }];


    this.listMaster['payType'] = [{ id: 'PKU', label: 'Pickup' }, { id: 'CE', label: 'Call' }, { id: 'ONL', label: 'Ecommerce' }];
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

    //Item
    this.list.items = this.router.getNavigatedData() || [];
    if (Object.keys(this.list.items).length == 0) this.list.items = [];
    this.updateTotal();
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
        this.listMaster['buyerType'] = res.data;
      } catch (e) {
        console.log(e);
      }
    })
  }

  getListCompanySearch(type_buyer) {
    this.orderService.getListCompany(type_buyer).subscribe(res => {
      try {
        this.listMaster['listCompanySearch'] = res.data.rows;
      } catch (e) {
        console.log(e);
      }
    })
  }

  /**
   * Internal Function
   */
  selectData(data) { }

  cloneRecord(record, list) {
    var newRecord = record;
    var index = list.indexOf(record);
    var objIndex = list[index];

    objIndex.products.push(newRecord);
    this.list.items = list;
    this.updateTotal();
  }

  checkLengthRecord(id, list) {
    var total = 0;
    var _list = list || this.list.items;

    _list.forEach(function (record) {
      if (id === record.item_id) {
        total++;
      }
    });

    return total;
  };


  checkCloneRecord(item, list) {

    try {
      var length = this.order['shipping'].length;
      if (!item.hasOwnProperty('length')) {
        item.length = function () {
          return this.checkLengthRecord(item, list);
        }
      }

      if (length) {
        var countItem = 1;

        if (list.products.length > 0) {
          countItem += list.products.length;
        }

        return countItem < length;
      }
    } catch (e) {
      return false;
    }
  };

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
      (this.list.items || []).forEach((item) => {
        var sub_quantity = 0;
        item.discount = item.discount != undefined ? item.discount : 0;
        if (!item.products) item.products = [];
        item.products.forEach((subItem, index) => {
          if (item.products.length > 0) {
            sub_quantity += Number(subItem.order_quantity);
          }
        });

        var value = (Number(item.sell_price) * (Number(item.order_quantity) + sub_quantity) - (Number(item.sell_price) * (Number(item.order_quantity) + sub_quantity)) * Number(item.discount) / 100) - (item.promotion_discount_amount ? item.promotion_discount_amount : 0);

        item.totalItem = value;

        if (value) {
          this.order_info.sub_total = this.order_info.sub_total + value;
        }
      });

    }
    this.order_info['shipping_cost'] = (this.order_info['shipping_cost'] != undefined ? this.order_info['shipping_cost'] : 0);
    this.order_info['alt_vat_percent'] = (this.order_info['vat_percent'] != undefined ? this.order_info['vat_percent'] : 0);
    this.order_info['alt_discount'] = (this.order_info['discount'] != undefined ? this.order_info['discount'] : 0);
    this.promotionList['total_invoice_discount'] = (this.promotionList['total_invoice_discount'] ? this.promotionList['total_invoice_discount'] : 0);

    this.order_info.total_discount = parseFloat((this.order_info.sub_total * Number(this.order_info['alt_discount']) / 100).toFixed(2))
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

  deleteAction(id) {
    this.list.items = this.list.items.filter(function (item) {
      return item.item_id != id
    })
    this.updateTotal();
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
          if(res.data.length == 0) return;
          this.order = res.data;
          if (this.list.items.length > 0) {
            for (var i = 0; i < this.list.items.length; i++) {
              this.list.items[i]['shipping_address_id'] =
                this.order['shipping'][0].id;
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
          this.ship = this.findDataById(id, this.order['shipping']);
          break;
        case 'billing':
          this.bill = this.findDataById(id, this.order['billing']);
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
        if (arr[i].address_id == id) {
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
          if (item.sell_price) item.sell_price = Number(item.sell_price);
          item['products'] = [];
          item.order_quantity = 1;
          item.totalItem = item.sell_price;
        })

        this.list.items = this.list.items.concat(res.filter(function (item) {
          return listAdded.indexOf(item.item_id) < 0;
        }));

        this.updateTotal();
      }
    });
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

    let products = [];
    this.list.items.forEach(function (item) {
      products.push({
        item_id: item.item_id,
        quantity: item.order_quantity,
        price: item.sell_price,
        discount_percent: item.discount || 0,
        shipping_address_id: item.shipping_address_id,
        warehouse_id: item.warehouse_id || 1
      });

      if (item.products.length > 0) {
        item.products.forEach(function (subItem, index) {
          products.push({
            item_id: subItem.item_id,
            quantity: subItem.order_quantity,
            price: subItem.sell_price,
            discount_percent: subItem.discount || 0,
            shipping_address_id: subItem.shipping_address_id,
            warehouse_id: subItem.warehouse_id || 1
          });
        });
      }

    });

    let params = {
      "brand_id": 1,
      "billing_id": this.billing,
      "products": products
    };

    params = Object.assign({}, this.order_info, this.generalForm.value, params);
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
