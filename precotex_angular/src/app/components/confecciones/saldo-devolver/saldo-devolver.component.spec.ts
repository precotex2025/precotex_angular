import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoDevolverComponent } from './saldo-devolver.component';

describe('SaldoDevolverComponent', () => {
  let component: SaldoDevolverComponent;
  let fixture: ComponentFixture<SaldoDevolverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaldoDevolverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldoDevolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
