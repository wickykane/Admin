import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { CommonShareModule } from '../../shared/index';
import { TableService } from "../../services/index";
import { ItemService } from "./item.service";

import { ItemModalContent } from "./item.modal";
import { AddressModalContent } from "./address.modal";
import { ConfirmModalContent } from "./confirm.modal";
//Modal


@NgModule({
  imports: [
    CommonModule,
    CommonShareModule
  ],
  declarations: [ItemModalContent, AddressModalContent, ConfirmModalContent],
  providers:[TableService,ItemService],
  exports:[ItemModalContent, AddressModalContent, ConfirmModalContent],
  entryComponents:[ItemModalContent, AddressModalContent, ConfirmModalContent]

})
export class ItemModalModule { }
