import { TableService } from './../../../services/table.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../order-mgmt.service';

import { routerTransition } from '../../../router.animations';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sale-order',
  templateUrl: './sale-order.component.html',
  styleUrls: ['./sale-order.component.scss'],
  animations: [routerTransition()]
})
export class SaleOrderComponent implements OnInit {

  /**
   * letiable Declaration
   */
  public listMaster = {};
  public selectedIndex = 0;
  public countStatus = {};
  public list = {
    items: []
  };
  // public showProduct: boolean = false;
  public onoffFilter: any;
  public listMoreFilter: any = [];

  searchForm: FormGroup;

  constructor(public router: Router,
    public fb: FormBuilder,
    public toastr: ToastrService,
    private vRef: ViewContainerRef,
    public tableService: TableService, private orderService: OrderService) {
     

    this.searchForm = fb.group({
      'code': [null],
      'cus_po': [null],
      'sale_quote_num': [null],
      'type': [null],
      'sts': [null],
      'buyer_name': [null],
      'date_type': [null],
      'date_to': [null],
      'date_from': [null],
      'ship_date_from': [null],
      'ship_date_to': [null],

    });

    // Assign get list function name, override letiable here
    this.tableService.getListFnName = 'getList';
    this.tableService.context = this;
  }

  ngOnInit() {
    // Init Fn
    this.listMoreFilter = [{ value: false, name: 'Date Filter' }];
    this.listMaster['type'] = [{ id: 'PKU', name: 'Pickup ' }, { id: 'NO', name: 'Regular Order' }, { id: 'ONL', name: 'Ecommerce' }];
    // this.countOrderStatus();
    this.getList();
    this.getListStatus();
  }
  /**
   * Table Event
   */
  selectData(index) {
    console.log(index);
  }
  /**
   * Internal Function
   */

  countOrderStatus() {
    this.orderService.countOrderStatus().subscribe(res => {
      this.countStatus = res.results[0];
    });
  }

  getListStatus() {
    this.orderService.getListStatus().subscribe(res => {
      this.listMaster['status'] = res.results;
    });

  }

  getList() {
    const params = Object.assign({}, this.tableService.getParams(), this.searchForm.value);

    Object.keys(params).forEach((key) => {
      if (params[key] instanceof Array) {
        params[key] = params[key].join(',');
      }
      (params[key] == null || params[key] === '') && delete params[key];
    });

    params.order = 'id';
    params.sort = 'desc';

    this.orderService.getListOrder(params).subscribe(res => {
      try {
        this.list.items = res.data.rows;
        this.tableService.matchPagingOption(res.data);
      } catch (e) {
        console.log(e);
      }
    });
  }

  cloneOrder = function (order_id) {
    this.orderService.cloneOrder(order_id).subscribe(res => {
      this.toastr.success(res.message);
      setTimeout(() => {
        this.getList();
      }, 500);
    },
      err => {
          this.toastr.error(err.message);
      }
    );
  };

  putApproveOrder(order_id) {
    this.orderService.approveOrd(order_id).subscribe(res => {
      this.toastr.success(res.message);
      setTimeout(() => {
        this.getList();
      }, 500);
    },
      err => {
          this.toastr.error(err.message);
      }
    );
  }

}
