import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCabeceraExternoComponent } from './dialog-cabecera-externo.component';

describe('DialogCabeceraExternoComponent', () => {
  let component: DialogCabeceraExternoComponent;
  let fixture: ComponentFixture<DialogCabeceraExternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCabeceraExternoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCabeceraExternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
