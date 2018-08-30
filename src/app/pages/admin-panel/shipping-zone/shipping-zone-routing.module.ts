import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ShippingZoneCreateComponent } from './create/shipping-zone.create.component';
import { ShippingZoneEditComponent } from './edit/shipping-zone.edit.component';
import { ShippingZoneComponent } from './list/shipping-zone.component';
import { ShippingZoneViewComponent } from './view/shipping-zone.view.component';

const routes: Routes = [
    {
        path: '', component: ShippingZoneComponent
    },
    {
        path: 'create', component: ShippingZoneCreateComponent,
    },
    {
        path: 'edit/:id', component: ShippingZoneEditComponent,
    },
    {
        path: 'view/:id', component: ShippingZoneViewComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShippingZoneRoutingModule { }
