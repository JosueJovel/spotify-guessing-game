import { TestBed } from '@angular/core/testing';

import { GeneralServicesService } from './general-services.service';

describe('GeneralServicesService', () => {
  let service: GeneralServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
