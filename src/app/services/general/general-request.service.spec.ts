import { TestBed } from '@angular/core/testing';

import { GeneralRequestService } from './general-request.service';

describe('GeneralRequestService', () => {
  let service: GeneralRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
