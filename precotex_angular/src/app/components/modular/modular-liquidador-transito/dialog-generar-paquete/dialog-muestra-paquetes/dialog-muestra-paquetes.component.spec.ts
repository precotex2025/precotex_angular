import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMuestraPaquetesComponent } from './dialog-muestra-paquetes.component';

describe('DialogMuestraPaquetesComponent', () => {
  let component: DialogMuestraPaquetesComponent;
  let fixture: ComponentFixture<DialogMuestraPaquetesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMuestraPaquetesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMuestraPaquetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
