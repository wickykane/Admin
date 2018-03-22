import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionBudgetComponent } from './promotion-budget.component';

describe('PromotionBudgetComponent', () => {
  let component: PromotionBudgetComponent;
  let fixture: ComponentFixture<PromotionBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
