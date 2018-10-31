import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomerManagementRoutingModule } from './customer-mgmt-routing.module';
import { CustomerEditComponent } from './customer/edit/customer-edit.component';

import { CustomerCreateComponent } from './customer/create/customer-create.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerAccountTabComponent } from './customer/information-tab/account/account-tab.component';
import { CustomerAddressTabComponent } from './customer/information-tab/address/address-tab.component';
import { CustomerContactTabComponent } from './customer/information-tab/contact/contact-tab.component';
import { CustomerCustomerBalanceTabComponent } from './customer/information-tab/customer-balance/customer-balance-tab.component';
import { CustomerInvoiceTabComponent } from './customer/information-tab/invoice/invoice-tab.component';
import { CustomerReceiptVoucherTabComponent } from './customer/information-tab/receipt-voucher/receipt-voucher-tab.component';
import { CustomerViewComponent } from './customer/view/customer-view.component';

import { CustomerPaymentTabComponent } from './customer/information-tab/payment/payment-tab.component';
import { CustomerQuoteTabComponent } from './customer/information-tab/quote/quote-tab.component';
import { CustomerRMATabComponent } from './customer/information-tab/rma/rma-tab.component';
import { CustomerSaleOrderTabComponent } from './customer/information-tab/sale-order/sale-order-tab.component';
import { CustomerShipmentTabComponent } from './customer/information-tab/shipment/shipment-tab.component';
import { CustomerSiteTabComponent } from './customer/information-tab/site/site-tab.component';


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
  declarations: [CustomerComponent, CustomerCreateComponent, CustomerViewComponent,
    CustomerAddressTabComponent, CustomerContactTabComponent, CustomerEditComponent, CustomerSiteTabComponent, CustomerQuoteTabComponent,
    CustomerSaleOrderTabComponent, CustomerInvoiceTabComponent, CustomerShipmentTabComponent, CustomerPaymentTabComponent,
    CustomerRMATabComponent, CustomerAccountTabComponent, CustomerReceiptVoucherTabComponent, CustomerCustomerBalanceTabComponent],
  providers: [TableService, CustomerService, Helper, CommonService ],
  entryComponents: []
})
export class CustomerMgmtModule { }
