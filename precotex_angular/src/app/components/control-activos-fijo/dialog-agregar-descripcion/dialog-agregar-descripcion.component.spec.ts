import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAgregarDescripcionComponent } from './dialog-agregar-descripcion.component';

describe('DialogAgregarDescripcionComponent', () => {
  let component: DialogAgregarDescripcionComponent;
  let fixture: ComponentFixture<DialogAgregarDescripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAgregarDescripcionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAgregarDescripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
