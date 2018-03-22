import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalePriceComponent } from './sale-price.component';

describe('SalePriceComponent', () => {
  let component: SalePriceComponent;
  let fixture: ComponentFixture<SalePriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalePriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
