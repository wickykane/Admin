import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionProductGroupComponent } from './condition-product-group.component';

describe('ConditionProductGroupComponent', () => {
  let component: ConditionProductGroupComponent;
  let fixture: ComponentFixture<ConditionProductGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionProductGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionProductGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
