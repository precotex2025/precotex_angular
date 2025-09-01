import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVaporizadoDefectosComponent } from './dialog-vaporizado-defectos.component';

describe('DialogVaporizadoDefectosComponent', () => {
  let component: DialogVaporizadoDefectosComponent;
  let fixture: ComponentFixture<DialogVaporizadoDefectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogVaporizadoDefectosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVaporizadoDefectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
