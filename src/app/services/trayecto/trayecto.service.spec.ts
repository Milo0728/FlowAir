import { TestBed } from '@angular/core/testing';

import { TrayectoService } from './trayecto.service';

describe('TrayectoService', () => {
  let service: TrayectoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrayectoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
