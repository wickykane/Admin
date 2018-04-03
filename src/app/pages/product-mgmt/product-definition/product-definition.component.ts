import { TableService } from './../../../services/table.service';
import { Component, OnInit } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from "../product-mgmt.service";

@Component({
  selector: 'app-product-definition',
  templateUrl: './product-definition.component.html'  
})
export class ProductDefinitionComponent implements OnInit {

  
  /**
   * Variable Declaration
   */
  public searchForm: FormGroup;
  public listMaster = {};
  public selectedIndex = 0;
  public list = {
    items: [],
    checklist:[]
  }
  public selectItem = {
    isCheckAll: false
}

  public data = {};

  /**
   * Init Data
   */

  constructor(
    private fb: FormBuilder,
    public tableService: TableService,
    private productService:ProductService
  ) { 
    this.searchForm = fb.group({
      'cd': [null],
      'name': [null],
      'sts': [null],
    });

    //Assign get list function name, override variable here
    this.tableService.getListFnName = 'getList';
    this.tableService.context = this;
  }

  ngOnInit() {
    //Init Fn
    this.getList();
  }
  /**
   * Table Event
   */
  selectData(index) {
    console.log(index);
  }
  checkExisted(list, id) {
    return list.filter(function(item) {
        return item.item_id == id;
    }).length;
  }
  checkItem(item) {
    if (item.is_checked && ! this.checkExisted(this.list.checklist, item.id)) {
        this.list.checklist.push(item);
    } else {
        this.list.checklist = this.list.checklist.filter(function(it) {
            return it.id != item.id;
        });
    }
  
    if (this.list.checklist.length == this.list.items.length) {
        this.selectItem.isCheckAll = true;
    } else this.selectItem.isCheckAll = false;
  }
  selectedItem (item) {
    item.is_checked = !item.is_checked;
    this.checkItem(item);
  }
  checkAll() {
    var flag = this.selectItem.isCheckAll;
    this.list.checklist = [];
    this.list.items.forEach(function(item) {
        item.is_checked = flag;
        if (flag && !this.checkExisted(this.list.checklist, item.id)) {
            this.list.checklist.push(item);
        }
    })
  };
  
  /**
   * Internal Function
   */

  getList() {
    var params = Object.assign({}, this.tableService.getParams(), this.searchForm.value);
    Object.keys(params).forEach((key) => (params[key] == null || params[key] == '') && delete params[key]);

    this.productService.getListItem(params).subscribe(res => {
      try {
        this.list.items = res.results.rows;
        this.list.items.forEach(item=>{
          item.thumb_img = item.wine_images[0].thumb_img!= undefined ? item.wine_images[0].thumb_img :'./assets/images/no_image_available.png' ;
        })        
        this.tableService.matchPagingOption(res.results);
      } catch (e) {
        console.log(e);
      }
    });
  }

}
