import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {OrderMgmtRoutingModule} from './order-mgmt-routing.module';

import { BuyerRfqComponent } from './buyer-rfq/buyer-rfq.component';
import { DeliveryOrderComponent } from './delivery-order/delivery-order.component';
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { SaleOrderCreateComponent } from './sale-order/sale-order.create.component';


import { SalePriceComponent } from './sale-price/sale-price.component';
import { SalePriceCreateComponent } from './sale-price/sale-price-create.component';
import { SalePriceEditComponent } from './sale-price/sale-price-edit.component';

import { SaleQuotationComponent } from './sale-quotation/sale-quotation.component';
import { OrderMgmtComponent } from './order-mgmt.component';

import { CommonShareModule, PageHeaderModule } from '../../shared/index';
import { TableService } from "../../services/index";
import {OrderService} from './order-mgmt.service';

import { ItemModalModule } from "../../shared/modals/item.module";

@NgModule({
  imports: [
    CommonModule,
    CommonShareModule,
    OrderMgmtRoutingModule,
    PageHeaderModule,
    ItemModalModule
  ],
  declarations: [BuyerRfqComponent, DeliveryOrderComponent, SaleOrderComponent, SalePriceComponent,SalePriceCreateComponent,
    SalePriceEditComponent, SaleQuotationComponent, OrderMgmtComponent, SaleOrderCreateComponent],
  providers:[OrderService,TableService]
})
export class OrderMgmtModule { }
