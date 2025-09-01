import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularAuditoriaModuloComponent } from './modular-auditoria-modulo.component';

describe('ModularAuditoriaModuloComponent', () => {
  let component: ModularAuditoriaModuloComponent;
  let fixture: ComponentFixture<ModularAuditoriaModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularAuditoriaModuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularAuditoriaModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
