import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerSegmentComponent } from './customer-segment/customer-segment.component';
import { CustomerSegmentCreateComponent } from './customer-segment/customer-segment.create.component';
import { CustomerSegmentEditComponent } from './customer-segment/customer-segment.edit.component';

import { CustomerComponent } from './customer/customer.component';
import { CustomerCreateComponent } from './customer/customer-create.component';
import { CustomerDetailComponent } from './customer/customer-detail.component';
import { CustomerViewComponent } from './customer/customer-view.component';
import { CustomerEditComponent } from './customer/customer-edit.component';

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
            { path: 'detail/:id', component: CustomerDetailComponent },
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
