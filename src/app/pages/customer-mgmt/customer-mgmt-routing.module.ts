import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerSegmentComponent } from "./customer-segment/customer-segment.component";
import { CustomerSegmentCreateComponent } from "./customer-segment/customer-segment.create.component";
import { CustomerSegmentEditComponent } from "./customer-segment/customer-segment.edit.component";

import { BuyerComponent } from "./buyer/buyer.component";
import { BuyerCreateComponent } from "./buyer/buyer-create.component";
import { BuyerDetailComponent } from "./buyer/buyer-detail.component";



const routes: Routes = [
    {
        path: 'customer-segment', 
        children : [
            { path: '', component: CustomerSegmentComponent },    
            { path: 'create', component: CustomerSegmentCreateComponent },    
            { path: 'edit/:id', component: CustomerSegmentEditComponent } 
        ]
    },
    {
        path: 'buyer',
        children : [
            { path: '', component: BuyerComponent },
            { path: 'create', component: BuyerCreateComponent },
            { path: 'detail/:id', component: BuyerDetailComponent }
        ]
    }
  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerManagementRoutingModule { }
