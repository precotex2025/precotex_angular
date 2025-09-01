import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetallePartidaRollosComponent } from './dialog-detalle-partida-rollos.component';

describe('DialogDetallePartidaRollosComponent', () => {
  let component: DialogDetallePartidaRollosComponent;
  let fixture: ComponentFixture<DialogDetallePartidaRollosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetallePartidaRollosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetallePartidaRollosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
