import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerManagementRoutingModule } from './customer-mgmt-routing.module';

import { CustomerSegmentComponent } from './customer-segment/customer-segment.component';
import { CustomerSegmentCreateComponent } from './customer-segment/customer-segment.create.component';
import { CustomerSegmentEditComponent } from './customer-segment/customer-segment.edit.component';

import { BuyerComponent } from './buyer/buyer.component';
import { BuyerCreateComponent } from './buyer/buyer-create.component';
import { BuyerDetailComponent } from './buyer/buyer-detail.component';


import { CustomerComponent } from './customer/customer.component';
import { CustomerCreateComponent } from './customer/customer-create.component';
import { CustomerDetailComponent } from './customer/customer-detail.component';
import { CustomerViewComponent } from './customer/customer-view.component';
import { CustomerAddressTabComponent } from './customer/information-tab/address-tab.component';
import { CustomerContactTabComponent } from './customer/information-tab/contact-tab.component';
import { CustomerSiteTabComponent } from './customer/information-tab/site-tab.component';
import { CustomerQuoteTabComponent } from './customer/information-tab/quote-tab.component';
import { CustomerSaleOrderTabComponent } from './customer/information-tab/sale-order-tab.component';


import { CommonShareModule } from '../../shared/index';
import { PageHeaderModule } from '../../shared';
import { TableService } from '../../services/index';
import { CustomerService } from './customer.service';

// Modal
import { ItemModalModule } from '../../shared/modals/item.module';


@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    CustomerManagementRoutingModule,
    CommonShareModule,
    ItemModalModule
  ],
  declarations: [CustomerSegmentComponent, CustomerSegmentCreateComponent,
    CustomerSegmentEditComponent, BuyerComponent, BuyerCreateComponent, BuyerDetailComponent,
    CustomerComponent, CustomerCreateComponent, CustomerDetailComponent, CustomerViewComponent,
    CustomerAddressTabComponent, CustomerContactTabComponent, CustomerSiteTabComponent, CustomerQuoteTabComponent,
    CustomerSaleOrderTabComponent],
  providers: [TableService, CustomerService],
  entryComponents: []
})
export class CustomerMgmtModule { }
