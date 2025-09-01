import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturaReposicionComponent } from './lectura-reposicion.component';

describe('LecturaReposicionComponent', () => {
  let component: LecturaReposicionComponent;
  let fixture: ComponentFixture<LecturaReposicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LecturaReposicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturaReposicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
