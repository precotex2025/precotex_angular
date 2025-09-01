import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroManteMaquinasHilosComponent } from './registro-mante-maquinas-hilos.component';

describe('RegistroManteMaquinasHilosComponent', () => {
  let component: RegistroManteMaquinasHilosComponent;
  let fixture: ComponentFixture<RegistroManteMaquinasHilosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroManteMaquinasHilosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroManteMaquinasHilosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
