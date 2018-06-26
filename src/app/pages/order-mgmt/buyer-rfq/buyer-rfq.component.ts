import { Component, OnInit } from '@angular/core';
import { TableService } from './../../../services/table.service';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {OrderService} from '../order-mgmt.service';

@Component({
  selector: 'app-buyer-rfq',
  templateUrl: './buyer-rfq.component.html',
  styleUrls: ['./buyer-rfq.component.scss']
})
export class BuyerRfqComponent implements OnInit {
  /**
   * Variable Declaration
   */
  public searchForm: FormGroup;
  public listMaster = {};
  public selectedIndex = 0;
  public list = {
    items: []
  }
  public showProduct: boolean = false;
  public flagId: string = '';

  public data = {};

  /**
   * Init Data
   */
  constructor(private fb: FormBuilder, public tableService: TableService, private orderService: OrderService) {
    this.searchForm = fb.group({
      'cd': [null],
      'name': [null]      
    });

    // Assign get list function name, override variable here
    this.tableService.getListFnName = 'getList';
    this.tableService.context = this;

  }

  ngOnInit() {    
   
    // Init Fn
    this.getList();
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
  toggleSubRow(id) {
    if (id === this.flagId) {
        this.flagId = '0';
    } else {
        this.flagId = id;
    }
    this.showProduct = !this.showProduct;
}

  getList() {
    var params = Object.assign({}, this.tableService.getParams(), this.searchForm.value);
    Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

    this.orderService.getListBuyerRFQ(params).subscribe(res => {
      try {
        this.list.items = res.results.rows;
        this.tableService.matchPagingOption(res.results);
      } catch (e) {
        console.log(e);
      }
    });
  }
  goToSaleQuote(id) {
    //  $state.go('app.orders.sales-quotation.buyerrfq',{id: id});            
}
}
