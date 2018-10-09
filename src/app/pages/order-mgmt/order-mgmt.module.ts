import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';


import { OrderMgmtRoutingModule } from './order-mgmt-routing.module';

//  Sale Order
import { SaleOrderCreateComponent } from './sale-order/create/sale-order.create.component';
import { SaleOrderEditComponent } from './sale-order/edit/sale-order.edit.component';
import { PrintInvoiceComponent } from './sale-order/print/print.invoice.component';
import { PrintOrderComponent } from './sale-order/print/print.oder.component';
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { SaleOrderDetailComponent } from './sale-order/view/sale-order.detail.component';

//  Sale Quotation
import { SaleQuotationCreateComponent } from './sale-quotation/create/sale-quotation.create.component';
import { SaleQuotationEditComponent } from './sale-quotation/edit/sale-quotation.edit.component';
import { SaleQuotationComponent } from './sale-quotation/sale-quotation.component';
import { SaleQuotationDetailComponent } from './sale-quotation/view/sale-quotation.detail.component';

//  Saleorder Tab
import { SaleOrderCreditNoteTabComponent } from './sale-order/order-tabs/credit-note-tab.component';
import { SaleOrderDebitNoteTabComponent } from './sale-order/order-tabs/debit-note-tab.component';
import { SaleOrderReceiptVoucherTabComponent } from './sale-order/order-tabs/receipt-voucher-tab.component';

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
import { QuoteInformationTabComponent } from './sale-quotation/quote-tabs/information-tab.component';
import { QuoteHistoryTabComponent } from './sale-quotation/quote-tabs/quote-history.component';

import { ItemsOrderModalContent } from './rma/modals/items-order.modal';

import { RmaCreateComponent } from './rma/create/rma.create.component';
import { RmaEditComponent } from './rma/edit/rma.edit.component';
import { RmaComponent } from './rma/list/rma.component';
import { ReturnOrderInformationTabComponent } from './rma/order-tabs/information-tab.component';
import { RMAService } from './rma/rma.service';
import { RmaDetailComponent } from './rma/view/rma.view.component';


@NgModule({
    imports: [
        CommonModule,
        CommonShareModule,
        OrderMgmtRoutingModule,
        PageHeaderModule,
        ItemModalModule
    ],
    declarations: [
        SaleOrderComponent,
        SaleQuotationComponent,
        SaleQuotationCreateComponent,
        SaleQuotationDetailComponent,
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
        SaleOrderCreditNoteTabComponent,
        SaleOrderEditComponent,
        SaleQuotationEditComponent,
        QuoteInformationTabComponent,
        QuoteHistoryTabComponent,
        SaleOrderDebitNoteTabComponent,
        SaleOrderReceiptVoucherTabComponent,
        ItemsOrderModalContent,
        RmaComponent,
        RmaCreateComponent,
        RmaEditComponent,
        RmaDetailComponent,
        ReturnOrderInformationTabComponent
        ],
    providers: [OrderService, TableService, DatePipe, Helper, RMAService],
    entryComponents: [ItemsOrderModalContent]
})
export class OrderMgmtModule { }
