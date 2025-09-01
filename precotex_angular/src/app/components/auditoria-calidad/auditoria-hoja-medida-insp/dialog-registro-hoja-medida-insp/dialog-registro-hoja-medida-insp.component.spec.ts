import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistroHojaMedidaInspComponent } from './dialog-registro-hoja-medida-insp.component';

describe('DialogRegistroHojaMedidaInspComponent', () => {
  let component: DialogRegistroHojaMedidaInspComponent;
  let fixture: ComponentFixture<DialogRegistroHojaMedidaInspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRegistroHojaMedidaInspComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRegistroHojaMedidaInspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
