import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbAlertModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { AdminPanelComponent } from './admin-panel.component';
import { BankComponent } from './bank/bank.component';
import { BankModalComponent } from './bank/modal/bank.modal';
import { BranchModalComponent } from './bank/modal/branch.modal';

import { PaymentTermComponent } from './payterm/payterm.component';

import { ShipmentMethodComponent } from './shipment-method/shipment-method.component';
import { UnitMeasureComponent } from './unit-measure/unit-measure.component';

import { UserModule } from './user/user.module';
import { WorkFlowModule } from './work-flow/work-flow.module';

import { TableService } from '../../services/index';
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
        CommonShareModule
    ],
    declarations: [
        AdminPanelComponent,
        UnitMeasureComponent,
        ShipmentMethodComponent,
        BankComponent,
        BankModalComponent,
        BranchModalComponent,
        PaymentTermComponent,
    ],
    entryComponents: [
        BankModalComponent,
        BranchModalComponent,
    ],
    providers: [TableService,
        AdminPanelService]
})
export class AdminPanelModule { }
