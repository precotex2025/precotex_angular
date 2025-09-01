import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularLiberarPaqueteComponent } from './modular-liberar-paquete.component';

describe('ModularLiberarPaqueteComponent', () => {
  let component: ModularLiberarPaqueteComponent;
  let fixture: ComponentFixture<ModularLiberarPaqueteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularLiberarPaqueteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularLiberarPaqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
