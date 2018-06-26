import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { CommonShareModule } from '../../shared/index';
import { TableService } from '../../services/index';
import { ItemService } from './item.service';

import { ItemModalContent } from './item.modal';
import { AddressModalContent } from './address.modal';
import { ConfirmModalContent } from './confirm.modal';

import { PromotionModalContent } from './promotion.modal';
import { SiteModalComponent } from './site.modal';

import { OrderSaleQuoteModalContent } from './order-salequote.modal';
import { InvoiceModalContent } from './invoice.modal';
import { OrderHistoryModalContent } from './order-history.modal';

//  Modal


@NgModule({
    imports: [
        CommonModule,
        CommonShareModule
    ],
    declarations: [ItemModalContent, AddressModalContent, ConfirmModalContent, PromotionModalContent, SiteModalComponent, OrderSaleQuoteModalContent, InvoiceModalContent, OrderHistoryModalContent],
    providers: [TableService, ItemService],
    exports: [ItemModalContent, AddressModalContent, ConfirmModalContent, PromotionModalContent, SiteModalComponent, OrderSaleQuoteModalContent, InvoiceModalContent, OrderHistoryModalContent],
    entryComponents: [ItemModalContent, AddressModalContent, ConfirmModalContent, PromotionModalContent, SiteModalComponent, OrderSaleQuoteModalContent, InvoiceModalContent, OrderHistoryModalContent]

})
export class ItemModalModule { }
