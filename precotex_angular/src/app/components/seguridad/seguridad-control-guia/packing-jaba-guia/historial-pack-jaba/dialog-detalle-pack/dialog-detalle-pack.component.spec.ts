import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetallePackComponent } from './dialog-detalle-pack.component';

describe('DialogDetallePackComponent', () => {
  let component: DialogDetallePackComponent;
  let fixture: ComponentFixture<DialogDetallePackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetallePackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetallePackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
