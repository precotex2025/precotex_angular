import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspeccionLiberacionPaqueteComponent } from './inspeccion-liberacion-paquete.component';

describe('InspeccionLiberacionPaqueteComponent', () => {
  let component: InspeccionLiberacionPaqueteComponent;
  let fixture: ComponentFixture<InspeccionLiberacionPaqueteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspeccionLiberacionPaqueteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspeccionLiberacionPaqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
