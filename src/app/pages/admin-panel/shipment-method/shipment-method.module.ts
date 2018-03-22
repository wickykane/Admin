import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { ShipmentMethodComponent } from './shipment-method.component';
import { StatModule , CommonShareModule, PageHeaderModule} from '../../../shared/index';
import { TableService } from "../../../services/index";
import { AdminPanelService } from '../admin-panel.service';

@NgModule({
  imports: [
    CommonModule,
    NgbAlertModule.forRoot(),
    StatModule,
    PageHeaderModule ,
    CommonShareModule   
  ],
  declarations: [
    ShipmentMethodComponent
  ],
  providers:[TableService]
})
export class ShipmentMethodModule { }
