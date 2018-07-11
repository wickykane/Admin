// Module
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NguCarouselModule } from '@ngu/carousel';
import { NgxGalleryModule } from 'ngx-gallery';
import { CommonShareModule, PageHeaderModule } from '../../shared/index';
import { ItemModalModule } from '../../shared/modals/item.module';

// Component
import { BundleMgmtCreateComponent } from './bundle-mgmt/bundle-mgmt-create.component';
import { BundleMgmtEditComponent } from './bundle-mgmt/bundle-mgmt-edit.component';
import { BundleMgmtComponent } from './bundle-mgmt/bundle-mgmt.component';
import { ConditionProductGroupCreateComponent } from './condition-product-group/condition-product-group-create.component';
import { ConditionProductGroupEditComponent } from './condition-product-group/condition-product-group-edit.component';
import { ConditionProductGroupComponent } from './condition-product-group/condition-product-group.component';
import { ECatalogCreateComponent } from './e-catalog/e-catalog-create.component';
import { ECatalogEditComponent } from './e-catalog/e-catalog-edit.component';
import { ECatalogComponent } from './e-catalog/e-catalog.component';
import { ItemListComponent } from './item-list/item-list.component';
import { MassPriceComponent } from './mass-price/mass-price.component';
import { MassPriceCreateComponent } from './mass-price/mass-price.create.component';
import { MassPriceViewComponent } from './mass-price/mass-price.view.component';
import { PartDetailComponent } from './part-mgmt/part-detail.component';
import { PartEditComponent } from './part-mgmt/part-edit.component';
import { PartListComponent } from './part-mgmt/part-list.component';
import { ProductDefinitionCreateComponent } from './product-definition/product-definition-create.component';
import { ProductDefinitionComponent } from './product-definition/product-definition.component';
import { ProductMgmtRoutingModule } from './product-mgmt-routing.module';
import { ProductMgmtComponent } from './product-mgmt.component';

// Services
import { TableService } from '../../services/index';
import { ProductService } from './product-mgmt.service';

@NgModule({
    imports: [
        CommonModule,
        ProductMgmtRoutingModule,
        CommonShareModule,
        PageHeaderModule,
        ItemModalModule,
        NgxGalleryModule,
        NguCarouselModule
    ],
    declarations: [
        ProductMgmtComponent,
        ItemListComponent,
        BundleMgmtComponent,
        ConditionProductGroupComponent,
        ECatalogComponent,
        ProductDefinitionComponent,
        ProductDefinitionCreateComponent,
        BundleMgmtCreateComponent,
        BundleMgmtEditComponent,
        ConditionProductGroupCreateComponent,
        ConditionProductGroupEditComponent,
        ECatalogCreateComponent,
        ECatalogEditComponent,
        MassPriceComponent,
        MassPriceCreateComponent,
        MassPriceViewComponent,
        PartListComponent,
        PartDetailComponent,
        PartEditComponent
    ],
    providers: [ProductService, TableService],
    entryComponents: []
})
export class ProductMgmtModule {}
