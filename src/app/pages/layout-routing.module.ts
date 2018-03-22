import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'guide' },
            { path: 'dashboard', loadChildren: '../pages/dashboard/dashboard.module#DashboardModule' },
            { path: 'blank-page', loadChildren: '../pages/blank-page/blank-page.module#BlankPageModule' },
            { path: 'admin-panel', loadChildren: '../pages/admin-panel/admin-panel.module#AdminPanelModule' },
            { path: 'guide', loadChildren: '../pages/guide/guide.module#GuideModule'},
            { path: 'purchase-management', loadChildren: '../pages/purchase-mgmt/purchase-mgmt.module#PurchaseManagementModule'}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
