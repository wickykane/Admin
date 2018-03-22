import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionCampaignComponent } from './promotion-campaign.component';

describe('PromotionCampaignComponent', () => {
  let component: PromotionCampaignComponent;
  let fixture: ComponentFixture<PromotionCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
