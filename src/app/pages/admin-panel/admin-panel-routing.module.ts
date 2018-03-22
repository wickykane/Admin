import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';
import { UnitMeasureComponent } from './unit-measure/unit-measure.component';
import { UserComponent } from './user/user.component';
import { UserCreateComponent } from './user/user-create.component';
import { ShipmentMethodComponent } from './shipment-method/shipment-method.component';

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
    }



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminPanelRoutingModule {
}
