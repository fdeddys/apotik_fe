import { TestBed } from '@angular/core/testing';

import { ApuptService } from './apupt.service';

describe('ApuptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApuptService = TestBed.get(ApuptService);
    expect(service).toBeTruthy();
  });
});
