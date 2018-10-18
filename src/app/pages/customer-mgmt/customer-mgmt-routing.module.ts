import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerCreateComponent } from './customer/customer-create.component';
import { CustomerEditComponent } from './customer/customer-edit.component';
import { CustomerViewComponent } from './customer/customer-view.component';
import { CustomerComponent } from './customer/customer.component';

import { MasterGuard } from '../../shared';

const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: CustomerComponent },
            { path: 'create', component: CustomerCreateComponent, canActivate: [MasterGuard] },
            { path: 'view/:id', component: CustomerViewComponent },
            { path: 'edit/:id', component: CustomerEditComponent, canActivate: [MasterGuard] }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerManagementRoutingModule { }
