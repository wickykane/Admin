import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { TableService } from '../../../services/index';
import { AdminPanelService } from '../admin-panel.service';


@Component({
  selector: 'app-shipment-method',
  providers: [AdminPanelService],
  templateUrl: 'shipment-method.component.html',
  animations: [routerTransition()]
})

export class ShipmentMethodComponent implements OnInit {
  public searchForm: FormGroup;
  public listMaster = {};
  public selectedIndex = 0;
  public list = {
    items: []
  };


  public data = {};
  constructor(
    private fb: FormBuilder,
    public tableService: TableService,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private adminPanelService: AdminPanelService,
    public toastr: ToastrService, ) {
    this.searchForm = fb.group({
      'type': [null]
    });

    // Assign get list function name, override variable here
    this.tableService.getListFnName = 'getList';
    this.tableService.context = this;
  }

  ngOnInit() {

    // Init Fn
    this.getListTypeMethod();
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
    const params = { ...this.tableService.getParams(), ...this.searchForm.value };
    Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

    this.adminPanelService.getListShipmentMethod(params).subscribe(res => {
      try {
        this.list.items = res.results.rows;
        this.tableService.matchPagingOption(res.results);
      } catch (e) {
        console.log(e);
      }
    });
  }
  getListTypeMethod() {
    this.adminPanelService.getListShipmentMethodType().subscribe(res => {
      try {
        this.listMaster['type'] = res.results;
      } catch (e) {
        console.log(e);
      }
    }, error => {
      console.log(error);
    });
  }
  changeStatus(item) {
    const params = { 'ac': item.is_sync_to_web };
    this.adminPanelService.updateShipmentMethod(item.id, params).subscribe(res => {
      try {
        if (res._type === 'success') {
          this.toastr.success(res.message);
        } else {
          this.toastr.error(res.message);
        }

      } catch (e) {
        console.log(e);
      }
    }, error => {
      console.log(error);
    });
  }
}
