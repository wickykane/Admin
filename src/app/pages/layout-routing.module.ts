import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterGuard } from '../shared';
import { PageDenyComponent } from './404/deny.component';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'guide' },
            { path: 'deny', component: PageDenyComponent},
            { path: 'dashboard', loadChildren: '../pages/dashboard/dashboard.module#DashboardModule' },
            { path: 'admin-panel', loadChildren: '../pages/admin-panel/admin-panel.module#AdminPanelModule' },
            { path: 'guide', loadChildren: '../pages/guide/guide.module#GuideModule' },
            { path: 'product-management', loadChildren: '../pages/product-mgmt/product-mgmt.module#ProductMgmtModule' },
            { path: 'order-management', loadChildren: '../pages/order-mgmt/order-mgmt.module#OrderMgmtModule' },
            { path: 'customer', loadChildren: '../pages/customer-mgmt/customer-mgmt.module#CustomerMgmtModule' },
            { path: 'financial', loadChildren: '../pages/financial/financial.module#FinancialModule' },
            { path: 'report', loadChildren: '../pages/reports-mgmt/reports.module#ReportsModule' },

        ],
        canActivate: [MasterGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
