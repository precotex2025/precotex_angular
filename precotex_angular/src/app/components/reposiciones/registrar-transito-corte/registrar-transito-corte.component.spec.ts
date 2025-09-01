import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarTransitoCorteComponent } from './registrar-transito-corte.component';

describe('RegistrarTransitoCorteComponent', () => {
  let component: RegistrarTransitoCorteComponent;
  let fixture: ComponentFixture<RegistrarTransitoCorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarTransitoCorteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarTransitoCorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
