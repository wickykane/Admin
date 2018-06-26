import { TableService } from './../../../services/table.service';
import { Component, OnInit } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../order-mgmt.service';


@Component({
  selector: 'app-sale-price',
  templateUrl: './sale-price.component.html',
   styleUrls: ['./sale-price.component.scss'],
  providers: [OrderService]
})

export class SalePriceComponent implements OnInit {
  /**
   * Variable Declaration
   */
  public searchForm: FormGroup;
  public listMaster = {};
  public selectedIndex = 0;
  public list = {
    items: []
  }

  public data = {};

  /**
   * Init Data
   */
  constructor(private fb: FormBuilder, public tableService: TableService,  private orderService: OrderService) {
    this.searchForm = fb.group({
      'cd': [null],
      'name': [null],
     
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

  getList() {
    var params = Object.assign({}, this.tableService.getParams(), this.searchForm.value);
    Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

    this.orderService.getList(params).subscribe(res => {
      try {
        this.list.items = res.results.rows;
        this.tableService.matchPagingOption(res.results);
      } catch (e) {
        console.log(e);
      }
    });
  }
}

