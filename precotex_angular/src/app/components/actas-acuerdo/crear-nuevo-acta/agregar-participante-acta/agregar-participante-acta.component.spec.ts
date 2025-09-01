import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarParticipanteActaComponent } from './agregar-participante-acta.component';

describe('AgregarParticipanteActaComponent', () => {
  let component: AgregarParticipanteActaComponent;
  let fixture: ComponentFixture<AgregarParticipanteActaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarParticipanteActaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarParticipanteActaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
