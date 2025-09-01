import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularReporteAuditoriaTicketComponent } from './modular-reporte-auditoria-ticket.component';

describe('ModularReporteAuditoriaTicketComponent', () => {
  let component: ModularReporteAuditoriaTicketComponent;
  let fixture: ComponentFixture<ModularReporteAuditoriaTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularReporteAuditoriaTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularReporteAuditoriaTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
