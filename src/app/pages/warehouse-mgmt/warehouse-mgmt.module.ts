import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WarehouseMgmtRoutingModule } from './warehouse-mgmt-routing.module';

import { PageHeaderModule } from '../../shared';
import { CommonShareModule, Helper } from '../../shared/index';

import { WarehourseComponent } from './warehourse/warehourse.component';

import { TableService } from '../../services/index';

@NgModule({
    imports: [
        CommonModule,
        WarehouseMgmtRoutingModule,
        PageHeaderModule,
        CommonShareModule
    ],
    declarations: [WarehourseComponent]
})
export class WarehouseMgmtModule {}
