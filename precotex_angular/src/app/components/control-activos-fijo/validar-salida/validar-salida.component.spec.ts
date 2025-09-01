import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidarSalidaComponent } from './validar-salida.component';

describe('ValidarSalidaComponent', () => {
  let component: ValidarSalidaComponent;
  let fixture: ComponentFixture<ValidarSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidarSalidaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidarSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
