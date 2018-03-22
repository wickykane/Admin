import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerRfqComponent } from './buyer-rfq.component';

describe('BuyerRfqComponent', () => {
  let component: BuyerRfqComponent;
  let fixture: ComponentFixture<BuyerRfqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
