import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';


import { OrderMgmtRoutingModule } from './order-mgmt-routing.module';

//  Buyer rfq
import { BuyerRfqComponent } from './buyer-rfq/buyer-rfq.component';

//  Delievery order
import { DelieveryOrderCreateComponent } from './delivery-order/delivery-order-create.component';
import { DelieveryOrderDetailComponent } from './delivery-order/delivery-order-detail.component';
import { DeliveryOrderComponent } from './delivery-order/delivery-order.component';

//  Sale Order
import { SaleOrderCreateComponent } from './sale-order/create/sale-order.create.component';
import { PrintInvoiceComponent } from './sale-order/print/print.invoice.component';
import { PrintOrderComponent } from './sale-order/print/print.oder.component';
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { SaleOrderDetailComponent } from './sale-order/view/sale-order.detail.component';

//  Sale Price
import { SalePriceCreateComponent } from './sale-price/sale-price-create.component';
import { SalePriceEditComponent } from './sale-price/sale-price-edit.component';
import { SalePriceComponent } from './sale-price/sale-price.component';

//  Sale Quotation
import { SaleQuotationCreateComponent } from './sale-quotation/create/sale-quotation.create.component';
import { SaleQuotationComponent } from './sale-quotation/sale-quotation.component';
import { SaleQuotationRfqCreateComponent } from './sale-quotation/sale-quotation.rfq.create.component';
import { SaleQuotationDetailComponent } from './sale-quotation/view/sale-quotation.detail.component';

//  Saleorder Tab
import { SaleOrderCreditNoteTabComponent } from './sale-order/order-tabs/credit-note-tab.component';
import { SaleOrderInformationTabComponent } from './sale-order/order-tabs/information-tab.component';
import { SaleOrderInvoiceTabComponent } from './sale-order/order-tabs/invoice-tab.component';
import { SaleOrderPaymentTabComponent} from './sale-order/order-tabs/payment-tab.component';
import { SaleOrderRMATabComponent} from './sale-order/order-tabs/rma-tab.component';
import { SaleOrderShipmentTabComponent } from './sale-order/order-tabs/shipment-tab.component';
import { SaleOrderTimelineTabComponent} from './sale-order/order-tabs/timeline-tab.component';

//  salequote tabs
import { SaleQuoteHistoryTabComponent } from './sale-order/order-tabs/quote-history.component';
import { SaleQuoteInformationTabComponent } from './sale-order/order-tabs/quote-info.component';

import { TableService } from '../../services/index';
import { CommonShareModule, Helper,  PageHeaderModule } from '../../shared/index';
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
        SaleQuoteHistoryTabComponent,
        SaleOrderRMATabComponent,
        SaleOrderCreditNoteTabComponent
        ],
    providers: [OrderService, TableService, DatePipe, Helper],
    entryComponents: []
})
export class OrderMgmtModule { }
