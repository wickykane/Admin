import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDefinitionComponent } from './product-definition.component';

describe('ProductDefinitionComponent', () => {
  let component: ProductDefinitionComponent;
  let fixture: ComponentFixture<ProductDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
