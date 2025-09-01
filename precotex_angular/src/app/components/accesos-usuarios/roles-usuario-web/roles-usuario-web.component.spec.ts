import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesUsuarioWebComponent } from './roles-usuario-web.component';

describe('RolesUsuarioWebComponent', () => {
  let component: RolesUsuarioWebComponent;
  let fixture: ComponentFixture<RolesUsuarioWebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesUsuarioWebComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesUsuarioWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
