import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerCreateComponent } from './customer/create/customer-create.component';
import { CustomerViewComponent } from './customer/customer-view.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerEditComponent } from './customer/edit/customer-edit.component';

import { MasterGuard } from '../../shared';

const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: CustomerComponent, canActivate: [MasterGuard], },
            { path: 'create', component: CustomerCreateComponent, canActivate: [MasterGuard], },
            { path: 'view/:id', component: CustomerViewComponent, canActivate: [MasterGuard], },
            { path: 'edit/:id', component: CustomerEditComponent, canActivate: [MasterGuard], }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerManagementRoutingModule { }
