import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberarPartidaCalidadComponent } from './liberar-partida-calidad.component';

describe('LiberarPartidaCalidadComponent', () => {
  let component: LiberarPartidaCalidadComponent;
  let fixture: ComponentFixture<LiberarPartidaCalidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiberarPartidaCalidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiberarPartidaCalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
