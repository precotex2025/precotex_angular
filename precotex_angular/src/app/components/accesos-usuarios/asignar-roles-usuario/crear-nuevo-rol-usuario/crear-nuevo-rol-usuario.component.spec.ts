import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNuevoRolUsuarioComponent } from './crear-nuevo-rol-usuario.component';

describe('CrearNuevoRolUsuarioComponent', () => {
  let component: CrearNuevoRolUsuarioComponent;
  let fixture: ComponentFixture<CrearNuevoRolUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearNuevoRolUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearNuevoRolUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
