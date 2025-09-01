import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobacionReposicionCorteComponent } from './aprobacion-reposicion-corte.component';

describe('AprobacionReposicionCorteComponent', () => {
  let component: AprobacionReposicionCorteComponent;
  let fixture: ComponentFixture<AprobacionReposicionCorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobacionReposicionCorteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobacionReposicionCorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
