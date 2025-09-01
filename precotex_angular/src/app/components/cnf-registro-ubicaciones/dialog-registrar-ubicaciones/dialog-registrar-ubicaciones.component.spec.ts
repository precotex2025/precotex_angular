import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistrarUbicacionesComponent } from './dialog-registrar-ubicaciones.component';

describe('DialogRegistrarUbicacionesComponent', () => {
  let component: DialogRegistrarUbicacionesComponent;
  let fixture: ComponentFixture<DialogRegistrarUbicacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRegistrarUbicacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRegistrarUbicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
