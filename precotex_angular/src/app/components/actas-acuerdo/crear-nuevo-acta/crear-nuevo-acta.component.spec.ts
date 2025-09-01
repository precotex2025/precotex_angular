import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNuevoActaComponent } from './crear-nuevo-acta.component';

describe('CrearNuevoActaComponent', () => {
  let component: CrearNuevoActaComponent;
  let fixture: ComponentFixture<CrearNuevoActaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearNuevoActaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearNuevoActaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
