import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TableService } from '../../services/index';
import { CommonShareModule } from '../../shared/index';
import { ItemService } from './item.service';

import { AddressModalContent } from './address.modal';
import { BackdropModalContent } from './backdrop.modal';
import { ConfirmModalContent } from './confirm.modal';
import { ItemMiscModalContent } from './item-misc.modal';
import { ItemQuoteModalContent } from './item-quote.modal';
import { ItemModalContent } from './item.modal';


import { RouterModule } from '@angular/router';
import { CustomRateOptionsModalComponent } from './custom-rate-options.modal';
import { FlatRateOptionsModalComponent } from './flat-rate-options.modal';
import { FreeShippingOptionsModalComponent } from './free-shipping-options.modal';
import { InvoiceModalContent } from './invoice.modal';
import { OrderHistoryModalContent } from './order-history.modal';
import { OrderSaleQuoteModalContent } from './order-salequote.modal';
import { PickupOptionsModalComponent } from './pickup-options.modal';
import { PromotionModalContent } from './promotion.modal';
import { QuoteModalContent } from './quote.modal';
import { SEFLConfigurationModalComponent } from './sefl-configuration.modal';
import { SiteModalComponent } from './site.modal';
import { StateFilterModalComponent } from './stateFilter.modal';
import { UPSConfigurationModalComponent } from './ups-configuration.modal';


//  Modal


@NgModule({
    imports: [
        CommonModule,
        CommonShareModule,
        RouterModule
    ],
    declarations: [QuoteModalContent, ItemMiscModalContent, ItemModalContent, AddressModalContent, ConfirmModalContent, BackdropModalContent,
        PromotionModalContent, SiteModalComponent, StateFilterModalComponent, FreeShippingOptionsModalComponent, FlatRateOptionsModalComponent, OrderSaleQuoteModalContent,
        ItemQuoteModalContent, CustomRateOptionsModalComponent, PickupOptionsModalComponent,
        InvoiceModalContent, OrderHistoryModalContent, UPSConfigurationModalComponent, SEFLConfigurationModalComponent],
    providers: [TableService, ItemService],
    exports: [QuoteModalContent, ItemMiscModalContent, ItemModalContent, AddressModalContent, ConfirmModalContent, BackdropModalContent, ItemQuoteModalContent,
        PromotionModalContent, SiteModalComponent, StateFilterModalComponent, FreeShippingOptionsModalComponent, FlatRateOptionsModalComponent, OrderSaleQuoteModalContent,
        InvoiceModalContent, CustomRateOptionsModalComponent, OrderHistoryModalContent, PickupOptionsModalComponent, UPSConfigurationModalComponent, SEFLConfigurationModalComponent],
    entryComponents: [QuoteModalContent, ItemMiscModalContent, ItemModalContent, AddressModalContent, ItemQuoteModalContent,
        ConfirmModalContent, BackdropModalContent, PromotionModalContent, SiteModalComponent, StateFilterModalComponent, FreeShippingOptionsModalComponent, FlatRateOptionsModalComponent,
        OrderSaleQuoteModalContent, InvoiceModalContent, OrderHistoryModalContent, CustomRateOptionsModalComponent, PickupOptionsModalComponent, UPSConfigurationModalComponent, SEFLConfigurationModalComponent]


})
export class ItemModalModule { }
