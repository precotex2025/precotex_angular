import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaEmpaqueAcabadoComponent } from './auditoria-empaque-acabado.component';

describe('AuditoriaEmpaqueAcabadoComponent', () => {
  let component: AuditoriaEmpaqueAcabadoComponent;
  let fixture: ComponentFixture<AuditoriaEmpaqueAcabadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaEmpaqueAcabadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaEmpaqueAcabadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
