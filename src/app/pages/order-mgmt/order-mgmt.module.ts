import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyerRfqComponent } from './buyer-rfq/buyer-rfq.component';
import { DeliveryOrderComponent } from './delivery-order/delivery-order.component';
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { SalePriceComponent } from './sale-price/sale-price.component';
import { SaleQuotationComponent } from './sale-quotation/sale-quotation.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [BuyerRfqComponent, DeliveryOrderComponent, SaleOrderComponent, SalePriceComponent, SaleQuotationComponent]
})
export class OrderMgmtModule { }
