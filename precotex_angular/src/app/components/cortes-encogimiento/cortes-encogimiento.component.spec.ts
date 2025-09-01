import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CortesEncogimientoComponent } from './cortes-encogimiento.component';

describe('CortesEncogimientoComponent', () => {
  let component: CortesEncogimientoComponent;
  let fixture: ComponentFixture<CortesEncogimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CortesEncogimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CortesEncogimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
