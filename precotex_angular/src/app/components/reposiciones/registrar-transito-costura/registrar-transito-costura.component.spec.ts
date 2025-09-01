import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarTransitoCosturaComponent } from './registrar-transito-costura.component';

describe('RegistrarTransitoCosturaComponent', () => {
  let component: RegistrarTransitoCosturaComponent;
  let fixture: ComponentFixture<RegistrarTransitoCosturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarTransitoCosturaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarTransitoCosturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
