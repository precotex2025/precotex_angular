import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSolicitudMntoAnulaComponent } from './dialog-solicitud-mnto-anula.component';

describe('DialogSolicitudMntoAnulaComponent', () => {
  let component: DialogSolicitudMntoAnulaComponent;
  let fixture: ComponentFixture<DialogSolicitudMntoAnulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSolicitudMntoAnulaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSolicitudMntoAnulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
