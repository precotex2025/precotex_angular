import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogActasParticipantesComponent } from './dialog-actas-participantes.component';

describe('DialogActasParticipantesComponent', () => {
  let component: DialogActasParticipantesComponent;
  let fixture: ComponentFixture<DialogActasParticipantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogActasParticipantesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogActasParticipantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
