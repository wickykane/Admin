import { Component, OnInit } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { OrderService } from "../order-mgmt.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detail-order',
  templateUrl: './sale-order.detail.component.html',
  styleUrls: ['./sale-order.component.scss']
})

export class SaleOrderDetailComponent implements OnInit {
  /**
   * Variable Declaration
   */
  public detail = {
    information: [],
    history: [],
    subs : [],
    general: [],
    buyer_info: [],
    billing: []
  };

  data = {};
  /**
   * Init Data
   */
  constructor(public toastr: ToastrService, private router: Router, private orderService: OrderService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.data["id"] = this.route.snapshot.paramMap.get('id');
    this.getDetail(this.data["id"]);
  }
  /**
   * Mater Data
   */
  getDetail(id) {
    if (id) {
      this.orderService.getOrderDetail(id).subscribe(res => {
        try {
          this.detail.information = res.results.order_detail;
          this.detail['billing'] = res.results.billing_info[0];
          this.detail['general'] = res.results;
          this.detail['subs'] = res.results.subs;
          this.detail['buyer_info'] = res.results.buyer_info;
        } catch (e) {
          console.log(e);
        }
      })
    }
  };

  /**
   * Internal Function
   */


}
