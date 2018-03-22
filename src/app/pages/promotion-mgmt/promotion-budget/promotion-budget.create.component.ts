import { Component, OnInit } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PromotionService } from "../promotion.service";

@Component({
  selector: 'app-promotion-budget',
  templateUrl: './promotion-budget.create.component.html',
  styleUrls: ['./promotion-budget.component.scss']
})

export class PromotionBudgetCreateComponent implements OnInit {
  /**
   * Variable Declaration
   */
  public generalForm: FormGroup;
  public listMaster = {};
  public selectedIndex = 0;
  public list = {
    items: [{}, {}, {}]
  }

  public data = {};

  /**
   * Init Data
   */
  constructor(private fb: FormBuilder, private promotionService: PromotionService) {
    this.generalForm = fb.group({
      'code': [null],
      'name': [null],
      'crtd_on': [new Date()],
    });



  }

  ngOnInit() {
    //Init data
    this.listMaster['status'] = [{ id: 'NW', name: "New " }, { id: 'AP', name: "Approved" }, { id: 'CL', name: "Close" }];
    //Init Fn
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

}
