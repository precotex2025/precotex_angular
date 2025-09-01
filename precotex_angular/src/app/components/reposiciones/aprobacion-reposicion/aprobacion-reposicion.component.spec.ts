import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobacionReposicionComponent } from './aprobacion-reposicion.component';

describe('AprobacionReposicionComponent', () => {
  let component: AprobacionReposicionComponent;
  let fixture: ComponentFixture<AprobacionReposicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobacionReposicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobacionReposicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
