import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGenerarDespachoComponent } from './dialog-generar-despacho.component';

describe('DialogGenerarDespachoComponent', () => {
  let component: DialogGenerarDespachoComponent;
  let fixture: ComponentFixture<DialogGenerarDespachoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogGenerarDespachoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGenerarDespachoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
