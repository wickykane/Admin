import { NgModule } from '@angular/core';
import { FulfillmentRoutingModule } from "./fulfillment.routing.module";

import { ScheduleComponent } from "./schedule/schedule.component";
import { DeliveryOrderComponent } from "./delivery-order/delivery-order.component";
import { RoutesComponent } from "./routes/routes.component";
import { TruckComponent } from "./trucks/truck.component";
import { TruckTypeComponent } from "./truck-type/truck-type.component";
import { DriverComponent } from "./drivers/drivers.component";

@NgModule({
    imports: [FulfillmentRoutingModule],
    exports: [],
    declarations: [ScheduleComponent, DeliveryOrderComponent, RoutesComponent, TruckComponent, TruckTypeComponent, DriverComponent],
    providers: [],
})
export class FulfillmentModule { }
