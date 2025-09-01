import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarRolesUsuarioComponent } from './asignar-roles-usuario.component';

describe('AsignarRolesUsuarioComponent', () => {
  let component: AsignarRolesUsuarioComponent;
  let fixture: ComponentFixture<AsignarRolesUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarRolesUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarRolesUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
