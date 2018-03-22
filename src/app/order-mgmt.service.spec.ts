import { TestBed, inject } from '@angular/core/testing';

import { OrderMgmtService } from './order-mgmt.service';

describe('OrderMgmtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderMgmtService]
    });
  });

  it('should be created', inject([OrderMgmtService], (service: OrderMgmtService) => {
    expect(service).toBeTruthy();
  }));
});
