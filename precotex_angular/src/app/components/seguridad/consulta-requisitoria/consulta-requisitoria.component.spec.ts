import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaRequisitoriaComponent } from './consulta-requisitoria.component';

describe('ConsultaRequisitoriaComponent', () => {
  let component: ConsultaRequisitoriaComponent;
  let fixture: ComponentFixture<ConsultaRequisitoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaRequisitoriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaRequisitoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
