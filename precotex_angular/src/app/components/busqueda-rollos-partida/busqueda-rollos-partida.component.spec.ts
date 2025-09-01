import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaRollosPartidaComponent } from './busqueda-rollos-partida.component';

describe('BusquedaRollosPartidaComponent', () => {
  let component: BusquedaRollosPartidaComponent;
  let fixture: ComponentFixture<BusquedaRollosPartidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusquedaRollosPartidaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaRollosPartidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
