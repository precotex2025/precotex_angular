import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSolicitudMntoInformeComponent } from './dialog-solicitud-mnto-informe.component';

describe('DialogSolicitudMntoInformeComponent', () => {
  let component: DialogSolicitudMntoInformeComponent;
  let fixture: ComponentFixture<DialogSolicitudMntoInformeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSolicitudMntoInformeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSolicitudMntoInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
