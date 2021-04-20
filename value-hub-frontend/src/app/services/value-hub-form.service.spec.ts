import { TestBed } from '@angular/core/testing';

import { ValueHubFormService } from './value-hub-form.service';

describe('ValueHubFormService', () => {
  let service: ValueHubFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValueHubFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
