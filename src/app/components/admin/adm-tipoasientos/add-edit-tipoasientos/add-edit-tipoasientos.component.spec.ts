import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTipoasientosComponent } from './add-edit-tipoasientos.component';

describe('AddEditTipoasientosComponent', () => {
  let component: AddEditTipoasientosComponent;
  let fixture: ComponentFixture<AddEditTipoasientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditTipoasientosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditTipoasientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
