import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialReposicionComponent } from './historial-reposicion.component';

describe('HistorialReposicionComponent', () => {
  let component: HistorialReposicionComponent;
  let fixture: ComponentFixture<HistorialReposicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialReposicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialReposicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
