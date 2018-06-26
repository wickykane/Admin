import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminPanelService } from '../admin-panel.service';
import { TableService } from '../../../services/index';
import { routerTransition } from '../../../router.animations';


@Component({
    selector: 'unit-measure',
    providers: [AdminPanelService],
    templateUrl: 'unit-measure.component.html',
    animations: [routerTransition()]
})

export class UnitMeasureComponent implements OnInit {
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
    constructor(
        private fb :FormBuilder,
        public tableService:TableService,
        private activeRouter: ActivatedRoute,
        private router: Router,       
        private AdminPanelService: AdminPanelService) {
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
            var params = Object.assign({}, this.tableService.getParams(), this.searchForm.value);
            Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);
        
            this.AdminPanelService.getListUOM(params).subscribe(res => {
              try {
                this.list.items = res.results.rows;
                this.tableService.matchPagingOption(res.results);
              } catch (e) {
                console.log(e);
              }
            });
          }
}
