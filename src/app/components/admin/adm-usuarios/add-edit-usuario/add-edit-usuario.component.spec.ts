import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUsuarioComponent } from './add-edit-usuario.component';

describe('AddEditUsuarioComponent', () => {
  let component: AddEditUsuarioComponent;
  let fixture: ComponentFixture<AddEditUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
