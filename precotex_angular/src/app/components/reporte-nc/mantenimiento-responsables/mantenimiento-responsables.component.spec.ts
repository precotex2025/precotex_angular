import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoResponsablesComponent } from './mantenimiento-responsables.component';

describe('MantenimientoResponsablesComponent', () => {
  let component: MantenimientoResponsablesComponent;
  let fixture: ComponentFixture<MantenimientoResponsablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantenimientoResponsablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoResponsablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
