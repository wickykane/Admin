import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ShippingZoneCreateComponent } from './create/shipping-zone.create.component';
import { ShippingZoneComponent } from './list/shipping-zone.component';


const routes: Routes = [
    {
        path: '', component: ShippingZoneComponent
    },
    {
        path: 'create', component: ShippingZoneCreateComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShippingZoneRoutingModule { }
