import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResponsablesNuevoComponent } from './dialog-responsables-nuevo.component';

describe('DialogResponsablesNuevoComponent', () => {
  let component: DialogResponsablesNuevoComponent;
  let fixture: ComponentFixture<DialogResponsablesNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogResponsablesNuevoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogResponsablesNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
