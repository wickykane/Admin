import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';
import { BankComponent } from './bank/bank.component';
import { ShipmentMethodComponent } from './shipment-method/shipment-method.component';
import { UnitMeasureComponent } from './unit-measure/unit-measure.component';
import { UserCreateComponent } from './user/user-create.component';
import { UserComponent } from './user/user.component';
import { WorkFlowComponent } from './work-flow/work-flow.component';
import { WorkFlowEditComponent } from './work-flow/work-flow.edit.component';


const routes: Routes = [
    {
        path: '', component: AdminPanelComponent
    },
    {
        path: 'unit-measure', component: UnitMeasureComponent
    },
    {
        path: 'shipment-method', component: ShipmentMethodComponent
    },
    {
        path: 'user', component: UserComponent
    },
    {
        path: 'user/create', component: UserCreateComponent
    },
    {
        path: 'work-flow', component: WorkFlowComponent
    },
    {
        path: 'work-flow/edit', component: WorkFlowEditComponent
    },
    {
        path: 'bank', component: BankComponent
    },


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminPanelRoutingModule {
}
