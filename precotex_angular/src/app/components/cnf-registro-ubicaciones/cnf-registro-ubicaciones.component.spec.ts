import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnfRegistroUbicacionesComponent } from './cnf-registro-ubicaciones.component';

describe('CnfRegistroUbicacionesComponent', () => {
  let component: CnfRegistroUbicacionesComponent;
  let fixture: ComponentFixture<CnfRegistroUbicacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnfRegistroUbicacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnfRegistroUbicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
