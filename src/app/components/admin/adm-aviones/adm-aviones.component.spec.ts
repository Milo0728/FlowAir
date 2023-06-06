import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmAvionesComponent } from './adm-aviones.component';

describe('AdmAvionesComponent', () => {
  let component: AdmAvionesComponent;
  let fixture: ComponentFixture<AdmAvionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmAvionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmAvionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
