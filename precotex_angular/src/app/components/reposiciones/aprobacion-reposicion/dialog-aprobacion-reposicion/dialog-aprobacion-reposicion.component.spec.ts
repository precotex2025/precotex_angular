import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAprobacionReposicionComponent } from './dialog-aprobacion-reposicion.component';

describe('DialogAprobacionReposicionComponent', () => {
  let component: DialogAprobacionReposicionComponent;
  let fixture: ComponentFixture<DialogAprobacionReposicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAprobacionReposicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAprobacionReposicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
