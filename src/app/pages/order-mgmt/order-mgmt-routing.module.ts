import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {OrderMgmtComponent} from './order-mgmt.component';
import { BuyerRfqComponent } from './buyer-rfq/buyer-rfq.component';
import { DeliveryOrderComponent } from './delivery-order/delivery-order.component';
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { SalePriceComponent } from './sale-price/sale-price.component';
import { SaleQuotationComponent } from './sale-quotation/sale-quotation.component';


const routes : Routes = [
  {
    path: '',
    component: OrderMgmtComponent
  }, {
    path: 'buyer-rfq',
    component: BuyerRfqComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderMgmtRoutingModule {}