import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmTipoasientosComponent } from './adm-tipoasientos.component';

describe('AdmTipoasientosComponent', () => {
  let component: AdmTipoasientosComponent;
  let fixture: ComponentFixture<AdmTipoasientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmTipoasientosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmTipoasientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
