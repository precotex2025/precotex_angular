import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularAuditoriaSalidaComponent } from './modular-auditoria-salida.component';

describe('ModularAuditoriaSalidaComponent', () => {
  let component: ModularAuditoriaSalidaComponent;
  let fixture: ComponentFixture<ModularAuditoriaSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularAuditoriaSalidaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularAuditoriaSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
