import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarTipoVisitaComponent } from './seleccionar-tipo-visita.component';

describe('SeleccionarTipoVisitaComponent', () => {
  let component: SeleccionarTipoVisitaComponent;
  let fixture: ComponentFixture<SeleccionarTipoVisitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeleccionarTipoVisitaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarTipoVisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
