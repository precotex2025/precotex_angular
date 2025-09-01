import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaVisitaComponent } from './consulta-visita.component';

describe('ConsultaVisitaComponent', () => {
  let component: ConsultaVisitaComponent;
  let fixture: ComponentFixture<ConsultaVisitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaVisitaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaVisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
