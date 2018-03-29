import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerManagementRoutingModule } from "./customer-mgmt-routing.module";

import { CustomerSegmentComponent } from "./customer-segment/customer-segment.component";
import { CustomerSegmentCreateComponent } from "./customer-segment/customer-segment.create.component";
import { CustomerSegmentEditComponent } from "./customer-segment/customer-segment.edit.component";

import { BuyerComponent } from "./buyer/buyer.component";
import { BuyerCreateComponent } from "./buyer/buyer-create.component";
import { BuyerDetailComponent } from "./buyer/buyer-detail.component";

import { CommonShareModule } from '../../shared/index';
import { PageHeaderModule } from '../../shared';
import { TableService } from "../../services/index";
import { CustomerService } from "./customer.service";

//Modal


@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    CustomerManagementRoutingModule,
    CommonShareModule
  ],
  declarations: [CustomerSegmentComponent, CustomerSegmentCreateComponent, CustomerSegmentEditComponent,BuyerComponent,BuyerCreateComponent,BuyerDetailComponent],
  providers: [TableService, CustomerService],
  entryComponents: []
})
export class CustomerMgmtModule { }
