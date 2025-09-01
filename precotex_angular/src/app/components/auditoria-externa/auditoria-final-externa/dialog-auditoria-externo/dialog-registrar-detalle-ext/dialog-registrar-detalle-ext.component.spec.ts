import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistrarDetalleExtComponent } from './dialog-registrar-detalle-ext.component';

describe('DialogRegistrarDetalleExtComponent', () => {
  let component: DialogRegistrarDetalleExtComponent;
  let fixture: ComponentFixture<DialogRegistrarDetalleExtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRegistrarDetalleExtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRegistrarDetalleExtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
