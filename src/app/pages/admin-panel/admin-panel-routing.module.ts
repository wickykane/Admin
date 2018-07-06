import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';
import { BankComponent } from './bank/bank.component';
import { BranchComponent } from './bank/branch/branch.component';
import { DiscountCategoryComponent } from './discount-category/discount-category.component';
import { DiscountCategoryCreateComponent } from './discount-category/discount-category.create.component';
import { DiscountComponent } from './discount/discount.component';
import { InsuranceBranchComponent } from './insurance-company/branch/branch.component';
import { InsuranceComponent } from './insurance-company/insurance.component';
import { PaymentTermComponent } from './payterm/payterm.component';
import { ReturnReasonComponent } from './return-reason/return-reason.component';
import { ShipmentMethodComponent } from './shipment-method/shipment-method.component';
import { UnitMeasureComponent } from './unit-measure/unit-measure.component';
import { UserCreateComponent } from './user/user-create.component';
import { UserComponent } from './user/user.component';
import { WarehouseCreateComponent } from './warehouse/warehouse-create.component';
import { WarehouseEditComponent } from './warehouse/warehouse-edit.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { WorkFlowComponent } from './work-flow/work-flow.component';
import { WorkFlowEditComponent } from './work-flow/work-flow.edit.component';

const routes: Routes = [
    {
        path: '',
        component: AdminPanelComponent
    },
    {
        path: 'unit-measure',
        component: UnitMeasureComponent
    },
    {
        path: 'shipment-method',
        component: ShipmentMethodComponent
    },
    {
        path: 'user',
        component: UserComponent
    },
    {
        path: 'user/create',
        component: UserCreateComponent
    },
    {
        path: 'work-flow',
        component: WorkFlowComponent
    },
    {
        path: 'work-flow/edit',
        component: WorkFlowEditComponent
    },
    {
        path: 'bank',
        children: [
            { path: ':id/branch', component: BranchComponent },
            { path: '', component: BankComponent }
        ]
    },
    {
        path: 'carrier',
        loadChildren: './carrier/carrier.module#CarrierModule'
    },
    {
        path: 'payment-term',
        component: PaymentTermComponent
    },
    {
        path: 'warehouse',
        component: WarehouseComponent
    },
    {
        path: 'warehouse/create',
        component: WarehouseCreateComponent
    },
    {
        path: 'warehouse/edit/:id',
        component: WarehouseEditComponent
    },
    {
        path: 'return-reason',
        component: ReturnReasonComponent
    },
    {
        path: 'discount-category',
        component: DiscountCategoryComponent
    },
    {
        path: 'discount-category/create',
        component: DiscountCategoryCreateComponent
    },
    {
        path: 'insurance',
        children: [
            { path: ':id/branch', component: InsuranceBranchComponent },
            { path: '', component: InsuranceComponent }
        ]
    },
    {
        path: 'discount',
        component: DiscountComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminPanelRoutingModule {}
