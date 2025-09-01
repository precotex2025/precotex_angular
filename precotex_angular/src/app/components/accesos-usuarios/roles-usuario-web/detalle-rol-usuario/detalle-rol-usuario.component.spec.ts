import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleRolUsuarioComponent } from './detalle-rol-usuario.component';

describe('DetalleRolUsuarioComponent', () => {
  let component: DetalleRolUsuarioComponent;
  let fixture: ComponentFixture<DetalleRolUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleRolUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleRolUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
