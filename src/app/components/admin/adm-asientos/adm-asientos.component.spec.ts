import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmAsientosComponent } from './adm-asientos.component';

describe('AdmAsientosComponent', () => {
  let component: AdmAsientosComponent;
  let fixture: ComponentFixture<AdmAsientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmAsientosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmAsientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
