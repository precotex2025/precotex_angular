import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratorioLecturaRecetasComponent } from './laboratorio-lectura-recetas.component';

describe('LaboratorioLecturaRecetasComponent', () => {
  let component: LaboratorioLecturaRecetasComponent;
  let fixture: ComponentFixture<LaboratorioLecturaRecetasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaboratorioLecturaRecetasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaboratorioLecturaRecetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
