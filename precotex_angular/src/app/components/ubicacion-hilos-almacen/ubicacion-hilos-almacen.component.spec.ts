import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbicacionHilosAlmacenComponent } from './ubicacion-hilos-almacen.component';

describe('UbicacionHilosAlmacenComponent', () => {
  let component: UbicacionHilosAlmacenComponent;
  let fixture: ComponentFixture<UbicacionHilosAlmacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UbicacionHilosAlmacenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbicacionHilosAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
