import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarUsuarioWebComponent } from './modificar-usuario-web.component';

describe('ModificarUsuarioWebComponent', () => {
  let component: ModificarUsuarioWebComponent;
  let fixture: ComponentFixture<ModificarUsuarioWebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarUsuarioWebComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarUsuarioWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
