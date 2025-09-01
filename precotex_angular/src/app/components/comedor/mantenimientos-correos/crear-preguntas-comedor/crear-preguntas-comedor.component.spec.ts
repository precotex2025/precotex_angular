import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPreguntasComedorComponent } from './crear-preguntas-comedor.component';

describe('CrearPreguntasComedorComponent', () => {
  let component: CrearPreguntasComedorComponent;
  let fixture: ComponentFixture<CrearPreguntasComedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearPreguntasComedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPreguntasComedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
