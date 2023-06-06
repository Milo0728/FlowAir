import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVueloComponent } from './add-edit-vuelo.component';

describe('AddEditVueloComponent', () => {
  let component: AddEditVueloComponent;
  let fixture: ComponentFixture<AddEditVueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditVueloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditVueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
