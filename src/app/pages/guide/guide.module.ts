import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { PageHeaderModule } from '../../shared';

import { GuideComponent } from './guide.component';
import { GuideRoutingModule } from './guide-routing.module';

@NgModule({
  imports: [
    CommonModule,
    GuideRoutingModule,
    PageHeaderModule
  ],
  declarations: [GuideComponent]
})
export class GuideModule { }
