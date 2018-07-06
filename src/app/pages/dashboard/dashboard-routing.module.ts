import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { OverallComponent } from './overall/overall.component';
import { PromotionComponent } from './promotion/promotion.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
    {
        path: 'promotion',
        children : [
            { path: '', component: PromotionComponent }
        ]
    },
    {
        path: 'overall',
        children : [
            { path: '', component: OverallComponent }
        ]
    },
    {
        path: 'reports',
        children : [
            { path: '', component: ReportComponent }
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
