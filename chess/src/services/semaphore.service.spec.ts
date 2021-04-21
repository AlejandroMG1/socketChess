import { TestBed } from '@angular/core/testing';

import { SemaphoreService } from './semaphore.service';

describe('SemaphoreService', () => {
  let service: SemaphoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SemaphoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
