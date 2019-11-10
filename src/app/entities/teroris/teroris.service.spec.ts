import { TestBed } from '@angular/core/testing';

import { TerorisService } from './teroris.service';

describe('TerorisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TerorisService = TestBed.get(TerorisService);
    expect(service).toBeTruthy();
  });
});
