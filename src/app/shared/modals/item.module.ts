import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


import { TableService } from '../../services/index';
import { CommonShareModule } from '../../shared/index';
import { ItemService } from './item.service';

import { AddressModalContent } from './address.modal';
import { ConfirmModalContent } from './confirm.modal';
import { ItemQuoteModalContent } from './item-quote.modal';
import { ItemModalContent } from './item.modal';

import { PromotionModalContent } from './promotion.modal';
import { SiteModalComponent } from './site.modal';
import { StateFilterModalComponent } from './stateFilter.modal';
import { FreeShippingOptionsModalComponent } from './free-shipping-options.modal';
import { FlatRateOptionsModalComponent } from './flat-rate-options.modal';
import { InvoiceModalContent } from './invoice.modal';
import { OrderHistoryModalContent } from './order-history.modal';
import { OrderSaleQuoteModalContent } from './order-salequote.modal';

//  Modal


@NgModule({
    imports: [
        CommonModule,
        CommonShareModule
    ],
    declarations: [ItemModalContent, AddressModalContent, ConfirmModalContent,
         PromotionModalContent, SiteModalComponent,StateFilterModalComponent,FreeShippingOptionsModalComponent,FlatRateOptionsModalComponent, OrderSaleQuoteModalContent,
         ItemQuoteModalContent,
          InvoiceModalContent, OrderHistoryModalContent],
    providers: [TableService, ItemService],
    exports: [ItemModalContent, AddressModalContent, ConfirmModalContent, ItemQuoteModalContent,
         PromotionModalContent, SiteModalComponent,StateFilterModalComponent,FreeShippingOptionsModalComponent,FlatRateOptionsModalComponent, OrderSaleQuoteModalContent,
          InvoiceModalContent, OrderHistoryModalContent],
    entryComponents: [ItemModalContent, AddressModalContent, ItemQuoteModalContent,
         ConfirmModalContent, PromotionModalContent, SiteModalComponent,StateFilterModalComponent,FreeShippingOptionsModalComponent,FlatRateOptionsModalComponent,
          OrderSaleQuoteModalContent, InvoiceModalContent, OrderHistoryModalContent]

})
export class ItemModalModule { }
