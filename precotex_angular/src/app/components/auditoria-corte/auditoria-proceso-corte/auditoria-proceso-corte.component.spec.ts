import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaProcesoCorteComponent } from './auditoria-proceso-corte.component';

describe('AuditoriaProcesoCorteComponent', () => {
  let component: AuditoriaProcesoCorteComponent;
  let fixture: ComponentFixture<AuditoriaProcesoCorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaProcesoCorteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaProcesoCorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
