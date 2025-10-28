import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSolicitudMntoCreateComponent } from './dialog-solicitud-mnto-create.component';

describe('DialogSolicitudMntoCreateComponent', () => {
  let component: DialogSolicitudMntoCreateComponent;
  let fixture: ComponentFixture<DialogSolicitudMntoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSolicitudMntoCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSolicitudMntoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
