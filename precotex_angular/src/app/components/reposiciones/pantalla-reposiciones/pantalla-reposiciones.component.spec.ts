import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaReposicionesComponent } from './pantalla-reposiciones.component';

describe('PantallaReposicionesComponent', () => {
  let component: PantallaReposicionesComponent;
  let fixture: ComponentFixture<PantallaReposicionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PantallaReposicionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PantallaReposicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
