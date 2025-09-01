import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivarSalidaComponent } from './activar-salida.component';

describe('ActivarSalidaComponent', () => {
  let component: ActivarSalidaComponent;
  let fixture: ComponentFixture<ActivarSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivarSalidaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivarSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
