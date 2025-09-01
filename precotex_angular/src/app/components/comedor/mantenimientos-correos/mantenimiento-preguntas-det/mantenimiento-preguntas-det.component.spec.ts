import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoPreguntasDetComponent } from './mantenimiento-preguntas-det.component';

describe('MantenimientoPreguntasDetComponent', () => {
  let component: MantenimientoPreguntasDetComponent;
  let fixture: ComponentFixture<MantenimientoPreguntasDetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantenimientoPreguntasDetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoPreguntasDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
