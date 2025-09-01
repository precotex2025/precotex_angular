import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogObservacionHojaMedidaInspComponent } from './dialog-observacion-hoja-medida-insp.component';

describe('DialogObservacionHojaMedidaInspComponent', () => {
  let component: DialogObservacionHojaMedidaInspComponent;
  let fixture: ComponentFixture<DialogObservacionHojaMedidaInspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogObservacionHojaMedidaInspComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogObservacionHojaMedidaInspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
