import { TestBed } from '@angular/core/testing';

import { MasterDataApprovalService } from './master-data-approval.service';

describe('MasterDataApprovalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MasterDataApprovalService = TestBed.get(MasterDataApprovalService);
    expect(service).toBeTruthy();
  });
});
