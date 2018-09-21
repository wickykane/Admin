import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'guide' },
            { path: 'dashboard', loadChildren: '../pages/dashboard/dashboard.module#DashboardModule' },
            { path: 'admin-panel', loadChildren: '../pages/admin-panel/admin-panel.module#AdminPanelModule' },
            { path: 'guide', loadChildren: '../pages/guide/guide.module#GuideModule' },
            { path: 'purchase-management', loadChildren: '../pages/purchase-mgmt/purchase-mgmt.module#PurchaseManagementModule' },
            { path: 'promotion', loadChildren: '../pages/promotion-mgmt/promotion-mgmt.module#PromotionMgmtModule' },
            { path: 'product-management', loadChildren: '../pages/product-mgmt/product-mgmt.module#ProductMgmtModule' },
            { path: 'order-management', loadChildren: '../pages/order-mgmt/order-mgmt.module#OrderMgmtModule' },
            { path: 'customer', loadChildren: '../pages/customer-mgmt/customer-mgmt.module#CustomerMgmtModule' },
            { path: 'rma', loadChildren: '../pages/rma/rma.module#RmaModule' },
            { path: 'financial', loadChildren: '../pages/financial/financial.module#FinancialModule' }

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
