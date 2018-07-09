import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { ChartsModule } from 'ng2-charts';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from '../../shared';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardService } from './dashboard.service';
import { OverallComponent } from './overall/overall.component';
import { PromotionComponent } from './promotion/promotion.component';
import { ReportComponent } from './report/report.component';



@NgModule({
    imports: [
        CommonModule,
        PageHeaderModule,
        DashboardRoutingModule,
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        ChartsModule
    ],
    declarations: [
    PromotionComponent,
    OverallComponent,
    ReportComponent
    ],
    providers: [DashboardService],
    entryComponents: []
})
export class DashboardModule {}
