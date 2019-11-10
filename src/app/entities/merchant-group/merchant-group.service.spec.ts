import { TestBed } from '@angular/core/testing';

import { MerchantGroupService } from './merchant-group.service';

describe('MerchantGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MerchantGroupService = TestBed.get(MerchantGroupService);
    expect(service).toBeTruthy();
  });
});
