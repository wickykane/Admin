import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';

import { MasterGuard } from '../../../shared';

const routes: Routes = [
    {
        path: '',
        data: {
            title: ''
        },
        children: [
            {
                path: '',
                canActivate: [MasterGuard],
                component: ListComponent,
                data: {
                    title: ''
                }
            },
            {
                path: 'create',
                canActivate: [MasterGuard],
                component: CreateComponent,
                data: {
                    title: ''
                }
            },
            {
                path: 'edit/:id',
                canActivate: [MasterGuard],
                component: CreateComponent,
                data: {
                    title: ''
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CarrierRoutingModule {}
