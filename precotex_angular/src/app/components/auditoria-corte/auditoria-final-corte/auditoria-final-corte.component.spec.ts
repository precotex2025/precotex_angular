import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaFinalCorteComponent } from './auditoria-final-corte.component';

describe('AuditoriaFinalCorteComponent', () => {
  let component: AuditoriaFinalCorteComponent;
  let fixture: ComponentFixture<AuditoriaFinalCorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaFinalCorteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaFinalCorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
