import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAgregarTallaComponent } from './dialog-agregar-talla.component';

describe('DialogAgregarTallaComponent', () => {
  let component: DialogAgregarTallaComponent;
  let fixture: ComponentFixture<DialogAgregarTallaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAgregarTallaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAgregarTallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
