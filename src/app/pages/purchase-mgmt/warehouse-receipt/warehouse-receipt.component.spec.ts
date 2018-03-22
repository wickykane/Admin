import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseReceiptComponent } from './warehouse-receipt.component';

describe('WarehouseReceiptComponent', () => {
  let component: WarehouseReceiptComponent;
  let fixture: ComponentFixture<WarehouseReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
