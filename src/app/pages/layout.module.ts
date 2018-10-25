import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderComponent } from '../pages/layout/header/header.component';
import { SidebarComponent } from '../pages/layout/sidebar/sidebar.component';
import { CommonShareModule, MasterGuard } from '../shared';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MenuComponent } from './layout/menu/menu.component';

import { StorageService } from '../services/storage.service';
import { PageDenyComponent } from './404/deny.component';



@NgModule({
    imports: [
        CommonModule,
        CommonShareModule,
        LayoutRoutingModule,
        TranslateModule,
        NgbDropdownModule.forRoot(),
    ],
    declarations: [PageDenyComponent, LayoutComponent, SidebarComponent, HeaderComponent, MenuComponent, FooterComponent],
    providers: [StorageService, MasterGuard]
})
export class LayoutModule { }
