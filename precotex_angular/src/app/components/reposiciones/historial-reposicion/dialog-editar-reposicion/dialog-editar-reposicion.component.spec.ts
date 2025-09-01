import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditarReposicionComponent } from './dialog-editar-reposicion.component';

describe('DialogEditarReposicionComponent', () => {
  let component: DialogEditarReposicionComponent;
  let fixture: ComponentFixture<DialogEditarReposicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditarReposicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditarReposicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
