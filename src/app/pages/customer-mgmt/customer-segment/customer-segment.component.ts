import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PromotionService } from '../../promotion-mgmt/promotion.service';
import { CustomerService } from '../customer.service';
import { TableService } from './../../../services/table.service';


@Component({
  selector: 'app-promotion-budget',
  templateUrl: './customer-segment.component.html',
  styleUrls: ['./customer-segment.component.scss'],
  providers: [PromotionService]
})

export class CustomerSegmentComponent implements OnInit {
  /**
   * Variable Declaration
   */
  public searchForm: FormGroup;
  public listMaster = {};
  public selectedIndex = 0;
  public list = {
    items: []
  };

  public data = {};

  /**
   * Init Data
   */
  constructor(private fb: FormBuilder,
    public tableService: TableService, private promotionService: PromotionService, private customerService: CustomerService) {
    this.searchForm = fb.group({
      'cd': [null],
      'name': [null],
      'apply_for': [null],
    });

    // Assign get list function name, override variable here
    this.tableService.getListFnName = 'getList';
    this.tableService.context = this;

  }

  ngOnInit() {
    // Init data
    this.listMaster['applyFor'] = [{
      id: '1',
      name: 'All customers'
    }, {
      id: '2',
      name: 'Specific Customers '
    }];
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
    const params = {...this.tableService.getParams(), ...this.searchForm.value};
    Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

    this.promotionService.getListSegment(params).subscribe(res => {
      try {
        this.list.items = res.results.rows;
        this.tableService.matchPagingOption(res.results);
      } catch (e) {
        console.log(e);
      }
    });
  }
}
