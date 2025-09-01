import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEncogimientoPrendaMedidasComponent } from './dialog-encogimiento-prenda-medidas.component';

describe('DialogEncogimientoPrendaMedidasComponent', () => {
  let component: DialogEncogimientoPrendaMedidasComponent;
  let fixture: ComponentFixture<DialogEncogimientoPrendaMedidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEncogimientoPrendaMedidasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEncogimientoPrendaMedidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
