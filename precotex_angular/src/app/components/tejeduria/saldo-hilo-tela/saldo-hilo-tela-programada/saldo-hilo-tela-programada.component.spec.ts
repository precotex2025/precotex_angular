import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoHiloTelaProgramadaComponent } from './saldo-hilo-tela-programada.component';

describe('SaldoHiloTelaProgramadaComponent', () => {
  let component: SaldoHiloTelaProgramadaComponent;
  let fixture: ComponentFixture<SaldoHiloTelaProgramadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaldoHiloTelaProgramadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldoHiloTelaProgramadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
