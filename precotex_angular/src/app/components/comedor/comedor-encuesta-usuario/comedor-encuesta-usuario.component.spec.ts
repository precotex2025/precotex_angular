import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComedorEncuestaUsuarioComponent } from './comedor-encuesta-usuario.component';

describe('ComedorEncuestaUsuarioComponent', () => {
  let component: ComedorEncuestaUsuarioComponent;
  let fixture: ComponentFixture<ComedorEncuestaUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComedorEncuestaUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComedorEncuestaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
