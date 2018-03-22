import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleQuotationComponent } from './sale-quotation.component';

describe('SaleQuotationComponent', () => {
  let component: SaleQuotationComponent;
  let fixture: ComponentFixture<SaleQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleQuotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
