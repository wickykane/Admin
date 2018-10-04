import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RmaComponent } from './list/rma.component';
import { RmaRoutingModule } from './rma-routing.module';


import { TableService } from '../../services/index';
import { CommonShareModule, Helper, PageHeaderModule } from '../../shared/index';
// Table Service
import { ItemModalModule } from '../../shared/modals/item.module';
import { ItemsOrderModalContent } from './modals/items-order.modal';

import { RmaCreateComponent } from './create/rma.create.component';
import { RmaEditComponent } from './edit/rma.edit.component';
import { RMAService } from './rma.service';
import { RmaDetailComponent } from './view/rma.view.component';

@NgModule({
    imports: [
        CommonModule,
        PageHeaderModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        CommonShareModule,
        RmaRoutingModule,
        ItemModalModule
    ],
    declarations: [ItemsOrderModalContent,
        RmaComponent,
        RmaCreateComponent,
        RmaEditComponent,
        RmaDetailComponent],
    providers: [RMAService, TableService, DatePipe, Helper],
    entryComponents: [
        ItemsOrderModalContent,
    ]
})
export class RmaModule { }
