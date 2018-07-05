import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: ''
        },
        children: [
            {
                path: '',
                component: ListComponent,
                data: {
                    title: ''
                }
            },
            {
                path: 'create',
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
