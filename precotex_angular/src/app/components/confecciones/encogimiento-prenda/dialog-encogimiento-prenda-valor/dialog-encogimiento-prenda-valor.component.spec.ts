import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEncogimientoPrendaValorComponent } from './dialog-encogimiento-prenda-valor.component';

describe('DialogEncogimientoPrendaValorComponent', () => {
  let component: DialogEncogimientoPrendaValorComponent;
  let fixture: ComponentFixture<DialogEncogimientoPrendaValorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEncogimientoPrendaValorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEncogimientoPrendaValorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
