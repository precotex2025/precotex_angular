import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCantidadDefectosCajasComponent } from './dialog-cantidad-defectos-cajas.component';

describe('DialogCantidadDefectosCajasComponent', () => {
  let component: DialogCantidadDefectosCajasComponent;
  let fixture: ComponentFixture<DialogCantidadDefectosCajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCantidadDefectosCajasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCantidadDefectosCajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
