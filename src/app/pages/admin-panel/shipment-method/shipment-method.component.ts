import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminPanelService } from '../admin-panel.service';
import { TableService } from '../../../services/index';
import { routerTransition } from '../../../router.animations';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'shipment-method',
    providers: [AdminPanelService],
    templateUrl: 'shipment-method.component.html',
    animations: [routerTransition()]
})

export class ShipmentMethodComponent implements OnInit {
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
		private AdminPanelService: AdminPanelService,
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
            var params = Object.assign({}, this.tableService.getParams(), this.searchForm.value);
            Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);
        
            this.AdminPanelService.getListShipmentMethod(params).subscribe(res => {
              try {
                this.list.items = res.results.rows;
                this.tableService.matchPagingOption(res.results);
              } catch (e) {
                console.log(e);
              }
            });
		  }
		  getListTypeMethod(){
			  this.AdminPanelService.getListShipmentMethodType().subscribe(res=>{
				try{
					this.listMaster['type'] = res.results;
				}catch(e){
					console.log(e);
				}
			  },error=>{
				console.log(error);
			  })
		  }
		  changeStatus(item){
			  let params ={'ac':item.is_sync_to_web};
			  this.AdminPanelService.updateShipmentMethod(item.id,params).subscribe(res=>{
				  try{
					  if(res._type=='success'){
						this.toastr.success(res.message);
					  }else{
						this.toastr.error(res.message);
					  }				

				  }catch(e){
					  console.log(e);
				  }
			  },error=>{
				  console.log(error);
			  })
		  }
}
