import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MasterGuard } from '../../shared';

import { CustomerOutstandingComponent } from './finance/reports/customer-outstanding/customer-outstanding.component';

const routes: Routes = [
    {
        path: 'finance-report',
        children: [
            // { path: '', component: /** put your List component in here */, canActivate: [MasterGuard] },
            // { path: 'list', component: /** put your List component in here */, canActivate: [MasterGuard] },
            { path: 'customer-outstanding', component: CustomerOutstandingComponent, canActivate: [MasterGuard] },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportsRoutingModule { }
