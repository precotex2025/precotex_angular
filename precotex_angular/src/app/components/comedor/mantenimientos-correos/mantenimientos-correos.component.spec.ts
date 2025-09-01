import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientosCorreosComponent } from './mantenimientos-correos.component';

describe('MantenimientosCorreosComponent', () => {
  let component: MantenimientosCorreosComponent;
  let fixture: ComponentFixture<MantenimientosCorreosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantenimientosCorreosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientosCorreosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
