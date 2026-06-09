import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoHiloTelaComponent } from './saldo-hilo-tela.component';

describe('SaldoHiloTelaComponent', () => {
  let component: SaldoHiloTelaComponent;
  let fixture: ComponentFixture<SaldoHiloTelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaldoHiloTelaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldoHiloTelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
