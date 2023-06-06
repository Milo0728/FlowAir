import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAvionComponent } from './add-edit-avion.component';

describe('AddEditAvionComponent', () => {
  let component: AddEditAvionComponent;
  let fixture: ComponentFixture<AddEditAvionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditAvionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAvionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
