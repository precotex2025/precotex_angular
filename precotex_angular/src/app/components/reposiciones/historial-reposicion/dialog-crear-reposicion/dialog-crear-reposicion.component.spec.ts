import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCrearReposicionComponent } from './dialog-crear-reposicion.component';

describe('DialogCrearReposicionComponent', () => {
  let component: DialogCrearReposicionComponent;
  let fixture: ComponentFixture<DialogCrearReposicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCrearReposicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCrearReposicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
