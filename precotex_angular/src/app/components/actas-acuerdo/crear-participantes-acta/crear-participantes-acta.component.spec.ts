import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearParticipantesActaComponent } from './crear-participantes-acta.component';

describe('CrearParticipantesActaComponent', () => {
  let component: CrearParticipantesActaComponent;
  let fixture: ComponentFixture<CrearParticipantesActaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearParticipantesActaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearParticipantesActaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
