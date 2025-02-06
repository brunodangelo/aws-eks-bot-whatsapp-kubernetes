import { TestBed } from '@angular/core/testing';

import { BasededatosService } from './basededatos.service';

describe('BasededatosService', () => {
  let service: BasededatosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasededatosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
