import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { AdminPanelComponent } from './admin-panel.component';
import { UnitMeasureComponent } from './unit-measure/unit-measure.component';
import { ShipmentMethodComponent } from './shipment-method/shipment-method.component';
import { UserModule } from './user/user.module';
import { WorkFlowModule } from './work-flow/work-flow.module';

import { CommonShareModule, PageHeaderModule,StatModule} from '../../shared/index';
import { TableService } from '../../services/index';
import {AdminPanelService} from './admin-panel.service';


@NgModule({
    imports: [
        CommonModule,
        NgbAlertModule.forRoot(),
        AdminPanelRoutingModule,
        StatModule,       
        UserModule,
        PageHeaderModule,
        WorkFlowModule,
        CommonShareModule
    ],
    declarations: [
        AdminPanelComponent,
        UnitMeasureComponent,
        ShipmentMethodComponent   
    ],
    providers:[TableService,
        AdminPanelService]
})
export class AdminPanelModule {}
