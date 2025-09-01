import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistrarVaporizadoDefectosComponent } from './dialog-registrar-vaporizado-defectos.component';

describe('DialogRegistrarVaporizadoDefectosComponent', () => {
  let component: DialogRegistrarVaporizadoDefectosComponent;
  let fixture: ComponentFixture<DialogRegistrarVaporizadoDefectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRegistrarVaporizadoDefectosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRegistrarVaporizadoDefectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
