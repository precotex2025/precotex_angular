import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoDevolverIndicadorComponent } from './saldo-devolver-indicador.component';

describe('SaldoDevolverIndicadorComponent', () => {
  let component: SaldoDevolverIndicadorComponent;
  let fixture: ComponentFixture<SaldoDevolverIndicadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaldoDevolverIndicadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldoDevolverIndicadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
