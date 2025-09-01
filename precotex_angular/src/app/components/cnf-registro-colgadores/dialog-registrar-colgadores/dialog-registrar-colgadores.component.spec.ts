import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistrarColgadoresComponent } from './dialog-registrar-colgadores.component';

describe('DialogRegistrarColgadoresComponent', () => {
  let component: DialogRegistrarColgadoresComponent;
  let fixture: ComponentFixture<DialogRegistrarColgadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRegistrarColgadoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRegistrarColgadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
