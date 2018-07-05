import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbAlertModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { ItemModalModule } from '../../shared/modals/item.module';
import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { AdminPanelComponent } from './admin-panel.component';

import { BankComponent } from './bank/bank.component';
import { BranchComponent } from './bank/branch/branch.component';
import { BankModalComponent } from './bank/modal/bank.modal';
import { BranchModalComponent } from './bank/modal/branch.modal';

import { PaymentTermComponent } from './payterm/payterm.component';
import { WarehourseComponent } from './warehourse/warehourse.component';

import { ShipmentMethodComponent } from './shipment-method/shipment-method.component';
import { UnitMeasureComponent } from './unit-measure/unit-measure.component';

import { UserModule } from './user/user.module';
import { WorkFlowModule } from './work-flow/work-flow.module';

import { CommonService, TableService } from '../../services/index';
import { CommonShareModule, PageHeaderModule, StatModule } from '../../shared/index';

import { AdminPanelService } from './admin-panel.service';


@NgModule({
    imports: [
        CommonModule,
        NgbAlertModule.forRoot(),
        AdminPanelRoutingModule,
        StatModule,
        UserModule,
        PageHeaderModule,
        WorkFlowModule,
        CommonShareModule,
        ItemModalModule
    ],
    declarations: [
        AdminPanelComponent,
        UnitMeasureComponent,
        ShipmentMethodComponent,
        BankComponent,
        BankModalComponent,
        BranchModalComponent,
        BranchComponent,
        PaymentTermComponent,
        WarehourseComponent,
    ],
    entryComponents: [
        BankModalComponent,
        BranchModalComponent,
    ],
    providers: [TableService, CommonService,
        AdminPanelService]
})
export class AdminPanelModule { }
