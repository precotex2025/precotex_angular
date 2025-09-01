import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmacenTelasCorteComponent } from './almacen-telas-corte.component';

describe('AlmacenTelasCorteComponent', () => {
  let component: AlmacenTelasCorteComponent;
  let fixture: ComponentFixture<AlmacenTelasCorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlmacenTelasCorteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlmacenTelasCorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
