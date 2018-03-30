import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { PromotionComponent } from './promotion/promotion.component';
import { OverallComponent } from './overall/overall.component';

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
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule{ }
