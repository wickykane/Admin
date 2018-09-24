// Module
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NguCarouselModule } from '@ngu/carousel';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgxGalleryModule } from 'ngx-gallery';
import { CommonShareModule, PageHeaderModule } from '../../shared/index';
import { ItemModalModule } from '../../shared/modals/item.module';

// Component
import { ItemListComponent } from './item-list/item-list.component';
import { MassPriceComponent } from './mass-price/mass-price.component';
import { MassPriceCreateComponent } from './mass-price/mass-price.create.component';
import { MassPriceViewComponent } from './mass-price/mass-price.view.component';
import { MiscellaneousItemsModalComponent } from './miscellaneous-items/controlMisscellaneous/misscellaneous-items.modal';
import { MiscellaneousItemsComponent } from './miscellaneous-items/list/miscellaneous-items.component';
import { PartDetailComponent } from './part-mgmt/part-detail.component';
import { PartEditComponent } from './part-mgmt/part-edit.component';
import { PartListComponent } from './part-mgmt/part-list.component';
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
        NguCarouselModule,
        NgSelectModule,
        FormsModule,
        CKEditorModule
    ],
    declarations: [
        ProductMgmtComponent,
        ItemListComponent,
                MassPriceComponent,
        MassPriceCreateComponent,
        MassPriceViewComponent,
        PartListComponent,
        PartDetailComponent,
        PartEditComponent,
        MiscellaneousItemsComponent,
        MiscellaneousItemsModalComponent
    ],
    providers: [ProductService, TableService],
    entryComponents: [MiscellaneousItemsModalComponent]
})
export class ProductMgmtModule {}
