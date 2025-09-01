import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EficienciaMaquinaTurnoComponent } from './eficiencia-maquina-turno.component';

describe('EficienciaMaquinaTurnoComponent', () => {
  let component: EficienciaMaquinaTurnoComponent;
  let fixture: ComponentFixture<EficienciaMaquinaTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EficienciaMaquinaTurnoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EficienciaMaquinaTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
