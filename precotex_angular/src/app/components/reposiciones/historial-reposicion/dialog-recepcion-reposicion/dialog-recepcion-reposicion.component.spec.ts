import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRecepcionReposicionComponent } from './dialog-recepcion-reposicion.component';

describe('DialogRecepcionReposicionComponent', () => {
  let component: DialogRecepcionReposicionComponent;
  let fixture: ComponentFixture<DialogRecepcionReposicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRecepcionReposicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRecepcionReposicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
