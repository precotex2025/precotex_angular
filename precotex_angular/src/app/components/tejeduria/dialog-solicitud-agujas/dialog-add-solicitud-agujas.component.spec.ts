import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddSolicitudAgujasComponent } from './dialog-add-solicitud-agujas.component';

describe('DialogCabeceraExternoComponent', () => {
  let component: DialogAddSolicitudAgujasComponent;
  let fixture: ComponentFixture<DialogAddSolicitudAgujasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddSolicitudAgujasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddSolicitudAgujasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
