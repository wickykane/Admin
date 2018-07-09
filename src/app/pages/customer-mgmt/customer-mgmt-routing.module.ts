import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerSegmentComponent } from './customer-segment/customer-segment.component';
import { CustomerSegmentCreateComponent } from './customer-segment/customer-segment.create.component';
import { CustomerSegmentEditComponent } from './customer-segment/customer-segment.edit.component';

import { CustomerCreateComponent } from './customer/customer-create.component';
import { CustomerEditComponent } from './customer/customer-edit.component';
import { CustomerViewComponent } from './customer/customer-view.component';
import { CustomerComponent } from './customer/customer.component';

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
        path: '',
        children : [
            { path: '', component: CustomerComponent },
            { path: 'create', component: CustomerCreateComponent },
            { path: 'view/:id', component: CustomerViewComponent },
            { path: 'edit/:id', component: CustomerEditComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerManagementRoutingModule { }
