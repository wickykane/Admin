import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ChartsModule } from 'ng2-charts';

import { PageHeaderModule } from '../../shared';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardService } from './dashboard.service';
import { PromotionComponent } from './promotion/promotion.component';
import { OverallComponent } from './overall/overall.component';
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
    providers:[DashboardService],
    entryComponents:[]
})
export class DashboardModule {}
