import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoSedeXAreaComponent } from './mantenimiento-sede-x-area.component';

describe('MantenimientoSedeXAreaComponent', () => {
  let component: MantenimientoSedeXAreaComponent;
  let fixture: ComponentFixture<MantenimientoSedeXAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantenimientoSedeXAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoSedeXAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
