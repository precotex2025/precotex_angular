import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularPaqueteParticionComponent } from './modular-paquete-particion.component';

describe('ModularPaqueteParticionComponent', () => {
  let component: ModularPaqueteParticionComponent;
  let fixture: ComponentFixture<ModularPaqueteParticionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularPaqueteParticionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularPaqueteParticionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
