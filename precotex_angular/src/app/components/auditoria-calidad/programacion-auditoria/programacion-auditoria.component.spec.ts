import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionAuditoriaComponent } from './programacion-auditoria.component';

describe('ProgramacionAuditoriaComponent', () => {
  let component: ProgramacionAuditoriaComponent;
  let fixture: ComponentFixture<ProgramacionAuditoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramacionAuditoriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramacionAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
