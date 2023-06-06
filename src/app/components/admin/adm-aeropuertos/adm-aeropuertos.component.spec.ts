import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmAeropuertosComponent } from './adm-aeropuertos.component';

describe('AdmAeropuertosComponent', () => {
  let component: AdmAeropuertosComponent;
  let fixture: ComponentFixture<AdmAeropuertosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmAeropuertosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmAeropuertosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
