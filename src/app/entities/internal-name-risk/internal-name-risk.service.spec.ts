import { TestBed } from '@angular/core/testing';

import { InternalNameRiskService } from './internal-name-risk.service';

describe('InternalNameRiskService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InternalNameRiskService = TestBed.get(InternalNameRiskService);
    expect(service).toBeTruthy();
  });
});
