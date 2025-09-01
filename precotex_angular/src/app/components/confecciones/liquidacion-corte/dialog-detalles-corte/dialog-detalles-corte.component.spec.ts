import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetallesCorteComponent } from './dialog-detalles-corte.component';

describe('DialogDetallesCorteComponent', () => {
  let component: DialogDetallesCorteComponent;
  let fixture: ComponentFixture<DialogDetallesCorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetallesCorteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetallesCorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
