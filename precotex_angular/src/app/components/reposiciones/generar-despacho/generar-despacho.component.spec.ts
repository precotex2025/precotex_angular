import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarDespachoComponent } from './generar-despacho.component';

describe('GenerarDespachoComponent', () => {
  let component: GenerarDespachoComponent;
  let fixture: ComponentFixture<GenerarDespachoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarDespachoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarDespachoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
