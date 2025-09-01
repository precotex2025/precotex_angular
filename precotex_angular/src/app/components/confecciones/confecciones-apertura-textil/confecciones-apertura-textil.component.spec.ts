import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfeccionesAperturaTextilComponent } from './confecciones-apertura-textil.component';

describe('ConfeccionesAperturaTextilComponent', () => {
  let component: ConfeccionesAperturaTextilComponent;
  let fixture: ComponentFixture<ConfeccionesAperturaTextilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfeccionesAperturaTextilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfeccionesAperturaTextilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
