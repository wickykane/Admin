import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';


import { OrderMgmtRoutingModule } from './order-mgmt-routing.module';

//  Buyer rfq
import { BuyerRfqComponent } from './buyer-rfq/buyer-rfq.component';

//  Delievery order
import { DeliveryOrderComponent } from './delivery-order/delivery-order.component';
import { DelieveryOrderCreateComponent } from './delivery-order/delivery-order-create.component';
import { DelieveryOrderDetailComponent } from './delivery-order/delivery-order-detail.component';

//  Sale Order
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { SaleOrderCreateComponent } from './sale-order/sale-order.create.component';
import { SaleOrderDetailComponent } from './sale-order/sale-order.detail.component';
import { PrintOrderComponent } from './sale-order/print/print.oder.component';
import { PrintInvoiceComponent } from './sale-order/print/print.invoice.component';

//  Sale Price
import { SalePriceComponent } from './sale-price/sale-price.component';
import { SalePriceCreateComponent } from './sale-price/sale-price-create.component';
import { SalePriceEditComponent } from './sale-price/sale-price-edit.component';

//  Sale Quotation
import { SaleQuotationComponent } from './sale-quotation/sale-quotation.component';
import { SaleQuotationCreateComponent } from './sale-quotation/sale-quotation.create.component';
import { SaleQuotationDetailComponent } from './sale-quotation/sale-quotation.detail.component';
import { SaleQuotationRfqCreateComponent } from './sale-quotation/sale-quotation.rfq.create.component';

//  Saleorder Tab
import { SaleOrderInformationTabComponent } from './sale-order/order-tabs/information-tab.component';
import { SaleOrderInvoiceTabComponent } from './sale-order/order-tabs/invoice-tab.component';
import { SaleOrderPaymentTabComponent} from './sale-order/order-tabs/payment-tab.component';
import { SaleOrderShipmentTabComponent } from './sale-order/order-tabs/shipment-tab.component';
import { SaleOrderTimelineTabComponent} from './sale-order/order-tabs/timeline-tab.component';

//  salequote tabs
import { SaleQuoteInformationTabComponent } from './sale-order/order-tabs/quote-info.component';
import { SaleQuoteHistoryTabComponent } from './sale-order/order-tabs/quote-history.component';

import { CommonShareModule, PageHeaderModule } from '../../shared/index';
import { TableService } from '../../services/index';
import { OrderService } from './order-mgmt.service';

import { ItemModalModule } from '../../shared/modals/item.module';


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
        SaleQuotationCreateComponent,
        SaleQuotationDetailComponent,
        SaleQuotationRfqCreateComponent,
        SaleOrderCreateComponent,
        SaleOrderDetailComponent,
        PrintOrderComponent,
        PrintInvoiceComponent,
        SaleOrderInformationTabComponent,
        SaleOrderInvoiceTabComponent,
        SaleOrderPaymentTabComponent,
        SaleOrderShipmentTabComponent,
        SaleOrderTimelineTabComponent,
        SaleQuoteInformationTabComponent,
        SaleQuoteHistoryTabComponent
        ],
    providers: [OrderService, TableService, DatePipe],
    entryComponents: []
})
export class OrderMgmtModule { }
