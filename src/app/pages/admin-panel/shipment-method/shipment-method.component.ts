import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminPanelService } from '../admin-panel.service';
import { TableService } from "../../../services/index";
import { routerTransition } from '../../../router.animations';

@Component({selector: 'app-shipment-method',
			templateUrl: './shipment-method.component.html',
			providers: [AdminPanelService],
			styleUrls: ['./shipment-method.component.scss'],
			animations: [routerTransition()]})
export class ShipmentMethodComponent implements OnInit {
  public list = {
    items: []
  };

  public sortParams = {
    order: "",
    sort: ""
  }

  public sortAction(param) {
    console.log("sort data: ", param);
  }

  public selectedIndex = 0;

  selectData(data) {
    console.log("id :", data);
  }

  constructor(
	private tableService: TableService,
    private activeRouter: ActivatedRoute,
    private router: Router,   
    private AdminPanelService:AdminPanelService
  ) {}

  ngOnInit() {
	  this.loadPage(1);
	}
  loadPage(page?:any){
    let params={
        page:page
    }
    this.AdminPanelService.getListShipmentMethod(params).subscribe(result=>{           
        if(result._type =='success'){
            this.list.items = result.results.rows;
        }
    },error=>{
        console.log(error);
    })
}

}
