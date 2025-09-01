import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatividadFichaTecnicaComponent } from './operatividad-ficha-tecnica.component';

describe('OperatividadFichaTecnicaComponent', () => {
  let component: OperatividadFichaTecnicaComponent;
  let fixture: ComponentFixture<OperatividadFichaTecnicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatividadFichaTecnicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatividadFichaTecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
