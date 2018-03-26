import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { CommonShareModule } from '../../shared/index';
import { TableService } from "../../services/index";
import { ItemService } from "./item.service";

//Modal


@NgModule({
  imports: [
    CommonModule,
    CommonShareModule
  ],
  declarations: [  ],
  providers:[TableService,ItemService],

})
export class ItemModalModule { }
