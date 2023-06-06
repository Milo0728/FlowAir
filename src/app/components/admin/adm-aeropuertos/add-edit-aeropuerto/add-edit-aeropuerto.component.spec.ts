import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAeropuertoComponent } from './add-edit-aeropuerto.component';

describe('AddEditAeropuertoComponent', () => {
  let component: AddEditAeropuertoComponent;
  let fixture: ComponentFixture<AddEditAeropuertoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditAeropuertoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAeropuertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
