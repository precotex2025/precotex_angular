import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarAreasUsuariosPermisosComponent } from './asignar-areas-usuarios-permisos.component';

describe('AsignarAreasUsuariosPermisosComponent', () => {
  let component: AsignarAreasUsuariosPermisosComponent;
  let fixture: ComponentFixture<AsignarAreasUsuariosPermisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarAreasUsuariosPermisosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarAreasUsuariosPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
