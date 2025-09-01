import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoJabaCocheComponent } from './mantenimiento-jaba-coche.component';

describe('MantenimientoJabaCocheComponent', () => {
  let component: MantenimientoJabaCocheComponent;
  let fixture: ComponentFixture<MantenimientoJabaCocheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantenimientoJabaCocheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoJabaCocheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
