import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEncogimientoPrendaRegistroComponent } from './dialog-encogimiento-prenda-registro.component';

describe('DialogEncogimientoPrendaRegistroComponent', () => {
  let component: DialogEncogimientoPrendaRegistroComponent;
  let fixture: ComponentFixture<DialogEncogimientoPrendaRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEncogimientoPrendaRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEncogimientoPrendaRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
