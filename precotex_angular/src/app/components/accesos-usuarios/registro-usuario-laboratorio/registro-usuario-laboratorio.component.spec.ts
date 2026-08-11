import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroUsuarioLaboratorioComponent } from './registro-usuario-laboratorio.component';

describe('RegistroUsuarioLaboratorioComponent', () => {
  let component: RegistroUsuarioLaboratorioComponent;
  let fixture: ComponentFixture<RegistroUsuarioLaboratorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroUsuarioLaboratorioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroUsuarioLaboratorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
