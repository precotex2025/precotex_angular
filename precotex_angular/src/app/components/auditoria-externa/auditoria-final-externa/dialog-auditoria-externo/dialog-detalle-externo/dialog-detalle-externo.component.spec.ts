import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetalleExternoComponent } from './dialog-detalle-externo.component';

describe('DialogDetalleExternoComponent', () => {
  let component: DialogDetalleExternoComponent;
  let fixture: ComponentFixture<DialogDetalleExternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetalleExternoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetalleExternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
