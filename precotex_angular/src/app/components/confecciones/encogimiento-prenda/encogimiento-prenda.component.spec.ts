import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncogimientoPrendaComponent } from './encogimiento-prenda.component';

describe('EncogimientoPrendaComponent', () => {
  let component: EncogimientoPrendaComponent;
  let fixture: ComponentFixture<EncogimientoPrendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncogimientoPrendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EncogimientoPrendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
