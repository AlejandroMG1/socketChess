import { TestBed } from '@angular/core/testing';

import { ChessService } from './chess-service.service';

describe('ChessServiceService', () => {
  let service: ChessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
