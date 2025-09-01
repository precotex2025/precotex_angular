import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSubDetalleExternoComponent } from './dialog-sub-detalle-externo.component';

describe('DialogSubDetalleExternoComponent', () => {
  let component: DialogSubDetalleExternoComponent;
  let fixture: ComponentFixture<DialogSubDetalleExternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSubDetalleExternoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSubDetalleExternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
