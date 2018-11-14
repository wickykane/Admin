import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MasterGuard } from '../../shared';

const routes: Routes = [
    {
        // path: 'finance',
        // children: [
        //     { path: '', component: /** put your List component in here */, canActivate: [MasterGuard] },
        //     { path: 'list', component: /** put your List component in here */, canActivate: [MasterGuard] },
        //     { path: 'customer-outstanding', component: /** put your component in here */, canActivate: [MasterGuard] },
        // ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportsRoutingModule { }
