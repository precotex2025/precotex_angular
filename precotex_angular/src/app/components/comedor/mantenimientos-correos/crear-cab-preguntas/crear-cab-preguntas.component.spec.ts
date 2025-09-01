import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCabPreguntasComponent } from './crear-cab-preguntas.component';

describe('CrearCabPreguntasComponent', () => {
  let component: CrearCabPreguntasComponent;
  let fixture: ComponentFixture<CrearCabPreguntasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearCabPreguntasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearCabPreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
