import { TestBed } from '@angular/core/testing';

import { HomeGuardService } from './home-guard.service';

describe('HomeGuardService', () => {
  let service: HomeGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
