import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarActivoFijoComponent } from './actualizar-activo-fijo.component';

describe('ActualizarActivoFijoComponent', () => {
  let component: ActualizarActivoFijoComponent;
  let fixture: ComponentFixture<ActualizarActivoFijoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualizarActivoFijoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarActivoFijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
