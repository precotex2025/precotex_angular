import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRetiroRepuestosCierreComponent } from './dialog-retiro-repuestos-cierre.component';

describe('DialogRetiroRepuestosCierreComponent', () => {
  let component: DialogRetiroRepuestosCierreComponent;
  let fixture: ComponentFixture<DialogRetiroRepuestosCierreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRetiroRepuestosCierreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRetiroRepuestosCierreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
