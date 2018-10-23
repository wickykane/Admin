import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ItemListComponent } from './item-list/item-list.component';
import { PartDetailComponent } from './part-mgmt/part-detail.component';
import { PartEditComponent } from './part-mgmt/part-edit.component';
import { PartListComponent } from './part-mgmt/part-list.component';

import { MasterGuard } from '../../shared';
import { ProductMgmtComponent } from './product-mgmt.component';

import { MassPriceComponent } from './mass-price/mass-price.component';
import { MassPriceCreateComponent } from './mass-price/mass-price.create.component';
import { MassPriceViewComponent } from './mass-price/mass-price.view.component';
import { MiscellaneousItemsComponent } from './miscellaneous-items/list/miscellaneous-items.component';
const routes: Routes = [
    {
        path: '',
        component: ProductMgmtComponent,
        canActivate: [MasterGuard]
    },
    {
        path: 'item-list',
        component: ItemListComponent,
        canActivate: [MasterGuard]
    },
    {
        path: 'part-list',
        component: PartListComponent,
        canActivate: [MasterGuard]
    },
    {
        path: 'miscellaneous-list',
        component: MiscellaneousItemsComponent,
        canActivate: [MasterGuard]
    },
    {
        path: 'part-list/detail/:id',
        component: PartDetailComponent,
        canActivate: [MasterGuard]
    },
     {
        path: 'part-list/edit/:id',
        component: PartEditComponent,
        canActivate: [MasterGuard]
    },
    {
        path: 'mass-price',
        children: [
            { path: '', component: MassPriceComponent, canActivate: [MasterGuard] },
            { path: 'create', component: MassPriceCreateComponent, canActivate: [MasterGuard] },
            { path: 'detail/:id', component: MassPriceViewComponent, canActivate: [MasterGuard] }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductMgmtRoutingModule {}
