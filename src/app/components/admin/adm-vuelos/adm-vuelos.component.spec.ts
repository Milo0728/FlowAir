import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmVuelosComponent } from './adm-vuelos.component';

describe('AdmVuelosComponent', () => {
  let component: AdmVuelosComponent;
  let fixture: ComponentFixture<AdmVuelosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmVuelosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmVuelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
