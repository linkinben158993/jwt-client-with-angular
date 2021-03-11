import { TestBed } from '@angular/core/testing';

import { NavGuardService } from './nav-guard.service';

describe('NavGuardService', () => {
  let service: NavGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
