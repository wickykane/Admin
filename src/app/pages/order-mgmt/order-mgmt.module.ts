import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderMgmtRoutingModule } from './order-mgmt-routing.module';

//Buyer rfq
import { BuyerRfqComponent } from './buyer-rfq/buyer-rfq.component';

//Delievery order
import { DeliveryOrderComponent } from './delivery-order/delivery-order.component';
import { DelieveryOrderCreateComponent } from './delivery-order/delivery-order-create.component';
import { DelieveryOrderDetailComponent } from './delivery-order/delivery-order-detail.component';

//Sale Order
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { SaleOrderCreateComponent } from './sale-order/sale-order.create.component';
import { SaleOrderDetailComponent } from './sale-order/sale-order.detail.component';
import { PrintOrderComponent } from './sale-order/print/print.oder.component';


//Sale Price
import { SalePriceComponent } from './sale-price/sale-price.component';
import { SalePriceCreateComponent } from './sale-price/sale-price-create.component';
import { SalePriceEditComponent } from './sale-price/sale-price-edit.component';

//Sale Quotation
import { SaleQuotationComponent } from './sale-quotation/sale-quotation.component';

import { CommonShareModule, PageHeaderModule } from '../../shared/index';
import { TableService } from "../../services/index";
import { OrderService } from './order-mgmt.service';

import { ItemModalModule } from "../../shared/modals/item.module";

@NgModule({
    imports: [
        CommonModule,
        CommonShareModule,
        OrderMgmtRoutingModule,
        PageHeaderModule,
        ItemModalModule
    ],
    declarations: [
        BuyerRfqComponent,
        DeliveryOrderComponent,
        DelieveryOrderDetailComponent,
        DelieveryOrderCreateComponent,
        SaleOrderComponent,
        SalePriceComponent,
        SalePriceCreateComponent,
        SalePriceEditComponent,
        SaleQuotationComponent,
        SaleOrderCreateComponent,
        SaleOrderDetailComponent,
        PrintOrderComponent],
    providers: [OrderService, TableService]
})
export class OrderMgmtModule { }
