import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterGuard } from '../../shared';
import { ReportFinanceListComponent } from './finance/list/list.component';

import { CustomerOutstandingComponent } from './finance/reports/customer-outstanding/customer-outstanding.component';

const routes: Routes = [
    {
        path: 'finance-report',
        children: [
            { path: '', component: ReportFinanceListComponent, canActivate: [MasterGuard]},
            { path: 'customer-outstanding', component: CustomerOutstandingComponent, canActivate: [MasterGuard] }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportsRoutingModule { }
