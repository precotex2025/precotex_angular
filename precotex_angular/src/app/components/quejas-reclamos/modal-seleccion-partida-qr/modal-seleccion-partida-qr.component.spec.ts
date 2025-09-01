import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSeleccionPartidaQrComponent } from './modal-seleccion-partida-qr.component';

describe('ModalSeleccionPartidaQrComponent', () => {
  let component: ModalSeleccionPartidaQrComponent;
  let fixture: ComponentFixture<ModalSeleccionPartidaQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSeleccionPartidaQrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSeleccionPartidaQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
