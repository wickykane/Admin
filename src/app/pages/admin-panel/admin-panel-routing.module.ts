import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';
import { BankComponent } from './bank/bank.component';
import { BranchComponent } from './bank/branch/branch.component';
import { DiscountCategoryComponent } from './discount-category/discount-category.component';
import { DiscountCategoryCreateComponent } from './discount-category/discount-category.create.component';
import { DiscountCategoryEditComponent } from './discount-category/discount-category.edit.component';
import { DiscountCloneComponent } from './discount/discount-clone.component';
import { DiscountCreateComponent } from './discount/discount-create.component';
import { DiscountDetailComponent } from './discount/discount-detail.component';
import { DiscountEditComponent } from './discount/discount-edit.component';
import { DiscountComponent } from './discount/discount.component';
import { EPIPolicyDetailComponent } from './epi-policy/epi-policy-detail.component';
import { EPIPolicyComponent } from './epi-policy/epi-policy.component';
import { InsuranceBranchComponent } from './insurance-company/branch/branch.component';
import { InsuranceComponent } from './insurance-company/insurance.component';
import { InvoiceConfigComponent } from './invoice-config/invoice-config.component';
import { LateFeePolicyDetailComponent } from './late-fee-policy/late-fee-policy-detail.component';
import { LateFeePolicyComponent } from './late-fee-policy/late-fee-policy.component';
import { LedgerComponent } from './ledger/ledger.component';
import { PaymentMethodsCreateComponent } from './payment-methods/create/payment-method-create.component';
import { PaymentMethodsListComponent } from './payment-methods/list/payment-methods-list.component';
import { PayTermCreateComponent } from './payterm/payterm-create.component';
import { PaymentTermComponent } from './payterm/payterm.component';
import { QuickbookOverviewComponent } from './quickbook-auth/overview/overview.component';
import { ReturnReasonCreateComponent } from './return-reason/return-reason-create.component';
import { ReturnReasonComponent } from './return-reason/return-reason.component';
import { SalesTaxAuthComponent } from './sales-tax-auth/sales-tax-auth.component';
import { ShipmentMethodComponent } from './shipment-method/shipment-method.component';
import { TaxTypesComponent } from './tax-types/tax-types.component';
import { UnitMeasureComponent } from './unit-measure/unit-measure.component';
import { UserCreateComponent } from './user/user-create.component';
import { UserComponent } from './user/user.component';
import { WarehouseCreateComponent } from './warehouse/warehouse-create.component';
import { WarehouseEditComponent } from './warehouse/warehouse-edit.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { WorkFlowComponent } from './work-flow/work-flow.component';
import { WorkFlowEditComponent } from './work-flow/work-flow.edit.component';

import { MasterGuard } from '../../shared';
import { ReturnPolicyComponent } from './return-policy-setup/return-policy.component';

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
            { path: '', component: BankComponent},
            { path: 'view/:id', canActivate: [MasterGuard], component: BranchComponent }
        ],
    },
    {
        path: 'carrier',
        canActivate: [MasterGuard],
        loadChildren: './carrier/carrier.module#CarrierModule'
    },
    {
        path: 'shipping-zone',
        canActivate: [MasterGuard],
        loadChildren: './shipping-zone/shipping-zone.module#ShippingZoneModule'
    },
    {
        path: 'payment-term',
        canActivate: [MasterGuard],
        component: PaymentTermComponent
    },
    {
        path: 'payment-term/create',
        canActivate: [MasterGuard],
        component: PayTermCreateComponent
    },
    {
        path: 'payment-term/edit/:id',
        canActivate: [MasterGuard],
        component: PayTermCreateComponent
    },
    {
        path: 'warehouse',
        canActivate: [MasterGuard],
        component: WarehouseComponent
    },
    {
        path: 'warehouse/create',
        canActivate: [MasterGuard],
        component: WarehouseCreateComponent
    },
    {
        path: 'warehouse/edit/:id',
        canActivate: [MasterGuard],
        component: WarehouseEditComponent
    },
    {
        path: 'warehouse/view/:id',
        canActivate: [MasterGuard],
        component: WarehouseEditComponent
    },
    {
        path: 'return-reason',
        canActivate: [MasterGuard],
        component: ReturnReasonComponent
    },
    {
        path: 'return-reason/create',
        canActivate: [MasterGuard],
        component: ReturnReasonCreateComponent
    },
    {
        path: 'return-reason/edit/:id',
        canActivate: [MasterGuard],
        component: ReturnReasonCreateComponent
    },
    {
        path: 'discount-category',
        component: DiscountCategoryComponent,
        canActivate: [MasterGuard]
    },
    {
        path: 'discount-category/create',
        component: DiscountCategoryCreateComponent,
        canActivate: [MasterGuard]
    },
    {
        path: 'discount-category/edit/:id',
        component: DiscountCategoryEditComponent,
        canActivate: [MasterGuard]
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
    },
    {
        path: 'discount/detail/:id',
        component: DiscountDetailComponent
    },
    {
        path: 'discount/create',
        component: DiscountCreateComponent
    },
    {
        path: 'discount/edit/:id',
        component: DiscountEditComponent
    },
    {
        path: 'discount/clone/:id',
        component: DiscountCloneComponent
    },
    {
        path: 'late-fee-policy',
        component: LateFeePolicyComponent,
        canActivate: [MasterGuard]
    },
    {
        path: 'late-fee-policy/create',
        component: LateFeePolicyDetailComponent,
        canActivate: [MasterGuard]
    },
    {
        path: 'late-fee-policy/view/:id',
        component: LateFeePolicyDetailComponent,
        canActivate: [MasterGuard]
    },
    {
        path: 'late-fee-policy/edit/:id',
        component: LateFeePolicyDetailComponent,
        canActivate: [MasterGuard]
    },
    {
        path: 'epi-policy',
        component: EPIPolicyComponent
    },
    {
        path: 'epi-policy/create',
        component: EPIPolicyDetailComponent
    },
    {
        path: 'epi-policy/view/:id',
        component: EPIPolicyDetailComponent
    },
    {
        path: 'epi-policy/edit/:id',
        component: EPIPolicyDetailComponent
    },
    {
        path: 'chasing-config',
        children: [
            { path: 'edit', canActivate: [MasterGuard], component: InvoiceConfigComponent }
        ],
    },
    {
        path: 'ledger',
        component: LedgerComponent,
        canActivate: [MasterGuard]
    },
    {
        path: 'payment-methods',
        component: PaymentMethodsListComponent,
        canActivate: [MasterGuard]
    },
    {
        path: 'payment-methods/create',
        component: PaymentMethodsCreateComponent,
        canActivate: [MasterGuard]
    },
    {
        path: 'payment-methods/edit/:id',
        component: PaymentMethodsCreateComponent,
        canActivate: [MasterGuard]
    },
    {
        path: 'tax-types',
        component: TaxTypesComponent
    },
    {
        path: 'sales-tax-auth',
        canActivate: [MasterGuard],
        component: SalesTaxAuthComponent
    },
    {
        path: 'return-policy-setup',
        canActivate: [MasterGuard],
        component: ReturnPolicyComponent
    },
    {
        path: 'quickbook-overview',
        canActivate: [MasterGuard],
        component: QuickbookOverviewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminPanelRoutingModule { }
