import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


import { TableService } from '../../services/index';
import { CommonShareModule } from '../../shared/index';
import { ItemService } from './item.service';

import { AddressModalContent } from './address.modal';
import { ConfirmModalContent } from './confirm.modal';
import { ItemMiscModalContent } from './item-misc.modal';
import { ItemQuoteModalContent } from './item-quote.modal';
import { ItemModalContent } from './item.modal';


import { FreeShippingOptionsModalComponent } from './free-shipping-options.modal';
import { FlatRateOptionsModalComponent } from './flat-rate-options.modal';
import { CustomRateOptionsModalComponent } from './custom-rate-options.modal';
import { PickupOptionsModalComponent} from './pickup-options.modal';
import { UPSConfigurationModalComponent} from './ups-configuration.modal';

import { InvoiceModalContent } from './invoice.modal';
import { OrderHistoryModalContent } from './order-history.modal';
import { OrderSaleQuoteModalContent } from './order-salequote.modal';
import { PromotionModalContent } from './promotion.modal';
import { SiteModalComponent } from './site.modal';
import { StateFilterModalComponent } from './stateFilter.modal';

//  Modal


@NgModule({
    imports: [
        CommonModule,
        CommonShareModule
    ],
    declarations: [ItemMiscModalContent,ItemModalContent, AddressModalContent, ConfirmModalContent,
         PromotionModalContent, SiteModalComponent,StateFilterModalComponent,FreeShippingOptionsModalComponent,FlatRateOptionsModalComponent, OrderSaleQuoteModalContent,
         ItemQuoteModalContent,CustomRateOptionsModalComponent,PickupOptionsModalComponent,
          InvoiceModalContent, OrderHistoryModalContent,UPSConfigurationModalComponent],
    providers: [TableService, ItemService],
    exports: [ItemMiscModalContent,ItemModalContent, AddressModalContent, ConfirmModalContent, ItemQuoteModalContent,
         PromotionModalContent, SiteModalComponent,StateFilterModalComponent,FreeShippingOptionsModalComponent,FlatRateOptionsModalComponent, OrderSaleQuoteModalContent,
          InvoiceModalContent,CustomRateOptionsModalComponent, OrderHistoryModalContent,PickupOptionsModalComponent,UPSConfigurationModalComponent],
    entryComponents: [ItemMiscModalContent,ItemModalContent, AddressModalContent, ItemQuoteModalContent,
         ConfirmModalContent, PromotionModalContent, SiteModalComponent,StateFilterModalComponent,FreeShippingOptionsModalComponent,FlatRateOptionsModalComponent,
          OrderSaleQuoteModalContent, InvoiceModalContent, OrderHistoryModalContent,CustomRateOptionsModalComponent,PickupOptionsModalComponent,UPSConfigurationModalComponent]

})
export class ItemModalModule { }
