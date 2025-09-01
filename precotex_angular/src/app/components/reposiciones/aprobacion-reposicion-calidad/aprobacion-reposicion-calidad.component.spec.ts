import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobacionReposicionCalidadComponent } from './aprobacion-reposicion-calidad.component';

describe('AprobacionReposicionCalidadComponent', () => {
  let component: AprobacionReposicionCalidadComponent;
  let fixture: ComponentFixture<AprobacionReposicionCalidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobacionReposicionCalidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobacionReposicionCalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
