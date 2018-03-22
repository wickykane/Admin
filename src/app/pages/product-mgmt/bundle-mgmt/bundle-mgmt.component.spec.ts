import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleMgmtComponent } from './bundle-mgmt.component';

describe('BundleMgmtComponent', () => {
  let component: BundleMgmtComponent;
  let fixture: ComponentFixture<BundleMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BundleMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundleMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
