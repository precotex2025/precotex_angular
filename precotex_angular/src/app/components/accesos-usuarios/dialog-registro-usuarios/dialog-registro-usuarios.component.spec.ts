import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistroUsuariosComponent } from './dialog-registro-usuarios.component';

describe('DialogRegistroUsuariosComponent', () => {
  let component: DialogRegistroUsuariosComponent;
  let fixture: ComponentFixture<DialogRegistroUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRegistroUsuariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRegistroUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
