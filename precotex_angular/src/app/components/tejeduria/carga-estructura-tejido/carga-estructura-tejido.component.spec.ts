import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaEstructuraTejidoComponent } from './carga-estructura-tejido.component';

describe('CargaEstructuraTejidoComponent', () => {
  let component: CargaEstructuraTejidoComponent;
  let fixture: ComponentFixture<CargaEstructuraTejidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaEstructuraTejidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaEstructuraTejidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
