import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleVueloComponent } from './detalle-vuelo.component';

describe('DetalleVueloComponent', () => {
  let component: DetalleVueloComponent;
  let fixture: ComponentFixture<DetalleVueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleVueloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleVueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
