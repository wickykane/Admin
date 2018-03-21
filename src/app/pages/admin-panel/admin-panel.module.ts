import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { AdminPanelComponent } from './admin-panel.component';

import { StatModule } from '../../shared/index';
import { UnitMeasureModule } from './unit-measure/unit-measure.module';

@NgModule({
    imports: [
        CommonModule,    
        NgbAlertModule.forRoot(),        
        AdminPanelRoutingModule,
        StatModule,
        UnitMeasureModule
    ],
    declarations: [
        AdminPanelComponent  
    ]
})
export class AdminPanelModule {}
