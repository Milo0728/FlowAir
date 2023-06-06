import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAsientoComponent } from './add-edit-asiento.component';

describe('AddEditAsientoComponent', () => {
  let component: AddEditAsientoComponent;
  let fixture: ComponentFixture<AddEditAsientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditAsientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAsientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
