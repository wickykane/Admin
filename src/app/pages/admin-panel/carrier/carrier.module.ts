import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CarrierRoutingModule } from './carrier-routing.module';

import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';

import { TableService } from '../../../services/index';
import { PageHeaderModule } from '../../../shared';
import { CommonShareModule, Helper } from '../../../shared/index';
import { CarrierService } from './carrier.service';

@NgModule({
    imports: [
        CommonModule,
        CarrierRoutingModule,
        PageHeaderModule,
        CommonShareModule
    ],
    declarations: [
       ListComponent,
       CreateComponent
    ],
    providers: [
        TableService,
        CarrierService,
        Helper
    ]
})
export class CarrierModule {}
