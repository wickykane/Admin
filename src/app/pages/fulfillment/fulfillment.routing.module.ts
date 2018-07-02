import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleComponent } from './schedule/schedule.component';
import { DeliveryOrderComponent } from './delivery-order/delivery-order.component';
import { RoutesComponent } from './routes/routes.component';
import { TruckComponent } from './trucks/truck.component';
import { TruckTypeComponent } from './truck-type/truck-type.component';
import { DriverComponent } from './drivers/drivers.component';


const routes: Routes = [
    { path: 'schedule', component: ScheduleComponent },
    { path: 'delivery-order', component: DeliveryOrderComponent },
    { path: 'route', component: RoutesComponent },
    { path: 'truck', component: TruckComponent },
    { path: 'truck-type', component: TruckTypeComponent },
    { path: 'driver', component: DriverComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FulfillmentRoutingModule { }
