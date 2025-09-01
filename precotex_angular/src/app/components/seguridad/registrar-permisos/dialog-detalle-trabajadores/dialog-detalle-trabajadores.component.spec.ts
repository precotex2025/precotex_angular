import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetalleTrabajadoresComponent } from './dialog-detalle-trabajadores.component';

describe('DialogDetalleTrabajadoresComponent', () => {
  let component: DialogDetalleTrabajadoresComponent;
  let fixture: ComponentFixture<DialogDetalleTrabajadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetalleTrabajadoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetalleTrabajadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
