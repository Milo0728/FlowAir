import { TestBed } from '@angular/core/testing';

import { TipoasientoService } from './tipoasiento.service';

describe('TipoasientoService', () => {
  let service: TipoasientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoasientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
