import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomerManagementRoutingModule } from './customer-mgmt-routing.module';
import { CustomerEditComponent } from './customer/customer-edit.component';

import { CustomerSegmentComponent } from './customer-segment/customer-segment.component';
import { CustomerSegmentCreateComponent } from './customer-segment/customer-segment.create.component';
import { CustomerSegmentEditComponent } from './customer-segment/customer-segment.edit.component';

import { CustomerCreateComponent } from './customer/customer-create.component';
import { CustomerDetailComponent } from './customer/customer-detail.component';
import { CustomerViewComponent } from './customer/customer-view.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerAccountTabComponent } from './customer/information-tab/account-tab.component';
import { CustomerAddressTabComponent } from './customer/information-tab/address-tab.component';
import { CustomerContactTabComponent } from './customer/information-tab/contact-tab.component';
import { CustomerInvoiceTabComponent } from './customer/information-tab/invoice-tab.component';
import { CustomerPaymentTabComponent } from './customer/information-tab/payment-tab.component';
import { CustomerQuoteTabComponent } from './customer/information-tab/quote-tab.component';
import { CustomerRMATabComponent } from './customer/information-tab/rma-tab.component';
import { CustomerSaleOrderTabComponent } from './customer/information-tab/sale-order-tab.component';
import { CustomerShipmentTabComponent } from './customer/information-tab/shipment-tab.component';
import { CustomerSiteTabComponent } from './customer/information-tab/site-tab.component';


import { CommonService } from '../../services/common.service';
import { TableService } from '../../services/index';
import { PageHeaderModule } from '../../shared';
import { CommonShareModule, Helper } from '../../shared/index';
import { CustomerService } from './customer.service';

//  Modal
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
    CustomerSegmentEditComponent,
    CustomerComponent, CustomerCreateComponent, CustomerDetailComponent, CustomerViewComponent,
    CustomerAddressTabComponent, CustomerContactTabComponent, CustomerEditComponent, CustomerSiteTabComponent, CustomerQuoteTabComponent,
    CustomerSaleOrderTabComponent, CustomerInvoiceTabComponent, CustomerShipmentTabComponent, CustomerPaymentTabComponent,
    CustomerRMATabComponent, CustomerAccountTabComponent],
  providers: [TableService, CustomerService, Helper, CommonService ],
  entryComponents: []
})
export class CustomerMgmtModule { }
