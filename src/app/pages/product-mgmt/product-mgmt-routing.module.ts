import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ItemListComponent } from './item-list/item-list.component';
import { PartDetailComponent } from './part-mgmt/part-detail.component';
import { PartEditComponent } from './part-mgmt/part-edit.component';
import { PartListComponent } from './part-mgmt/part-list.component';

import { ProductMgmtComponent } from './product-mgmt.component';

import { MassPriceComponent } from './mass-price/mass-price.component';
import { MassPriceCreateComponent } from './mass-price/mass-price.create.component';
import { MassPriceViewComponent } from './mass-price/mass-price.view.component';
import { MiscellaneousItemsComponent } from './miscellaneous-items/list/miscellaneous-items.component';
const routes: Routes = [
    {
        path: '',
        component: ProductMgmtComponent
    },
    {
        path: 'item-list',
        component: ItemListComponent
    },
    {
        path: 'part-list',
        component: PartListComponent
    },
    {
        path: 'miscellaneous-list',
        component: MiscellaneousItemsComponent
    },
    {
        path: 'part-list/detail/:id',
        component: PartDetailComponent
    },
     {
        path: 'part-list/edit/:id',
        component: PartEditComponent
    },
    {
        path: 'mass-price',
        children: [
            { path: '', component: MassPriceComponent },
            { path: 'create', component: MassPriceCreateComponent },
            { path: 'detail/:id', component: MassPriceViewComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductMgmtRoutingModule {}
