import { TestBed } from '@angular/core/testing';

import { ProvinsiService } from './provinsi.service';

describe('ProvinsiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProvinsiService = TestBed.get(ProvinsiService);
    expect(service).toBeTruthy();
  });
});
