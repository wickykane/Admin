import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { routerTransition } from '../../../router.animations';
import { TableService } from '../../../services/index';
import { AdminPanelService } from '../admin-panel.service';


@Component({
    selector: 'app-unit-measure',
    providers:  [AdminPanelService ],
    templateUrl: 'unit-measure.component.html',
    animations: [routerTransition()]
})

export class UnitMeasureComponent implements OnInit {
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
        private adminPanelService: AdminPanelService) {
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

          getList() {
            const params = {...this.tableService.getParams(), ...this.searchForm.value};
            Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

            this.adminPanelService.getListUOM(params).subscribe(res => {
              try {
                this.list.items = res.results.rows;
                this.tableService.matchPagingOption(res.results);
              } catch (e) {
                console.log(e);
              }
            });
          }
}
