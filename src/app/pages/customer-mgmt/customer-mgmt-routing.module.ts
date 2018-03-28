import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerSegmentComponent } from "./customer-segment/customer-segment.component";
import { CustomerSegmentCreateComponent } from "./customer-segment/customer-segment.create.component";
import { CustomerSegmentEditComponent } from "./customer-segment/customer-segment.edit.component";


const routes: Routes = [
    {
        path: 'customer-segment', 
        children : [
            { path: '', component: CustomerSegmentComponent },    
            { path: 'create', component: CustomerSegmentCreateComponent },    
            { path: 'edit/:id', component: CustomerSegmentEditComponent },    
            
            
        ]
    }
  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerManagementRoutingModule { }
