import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoPreguntasComponent } from './mantenimiento-preguntas.component';

describe('MantenimientoPreguntasComponent', () => {
  let component: MantenimientoPreguntasComponent;
  let fixture: ComponentFixture<MantenimientoPreguntasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantenimientoPreguntasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoPreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
