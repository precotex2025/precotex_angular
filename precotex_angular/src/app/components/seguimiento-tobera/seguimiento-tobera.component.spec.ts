import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoToberaComponent } from './seguimiento-tobera.component';

describe('SeguimientoToberaComponent', () => {
  let component: SeguimientoToberaComponent;
  let fixture: ComponentFixture<SeguimientoToberaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguimientoToberaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoToberaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
