import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundDeliveryComponent } from './inbound-delivery.component';

describe('InboundDeliveryComponent', () => {
  let component: InboundDeliveryComponent;
  let fixture: ComponentFixture<InboundDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboundDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboundDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
