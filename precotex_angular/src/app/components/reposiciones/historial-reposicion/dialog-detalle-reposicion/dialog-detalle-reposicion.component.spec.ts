import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetalleReposicionComponent } from './dialog-detalle-reposicion.component';

describe('DialogDetalleReposicionComponent', () => {
  let component: DialogDetalleReposicionComponent;
  let fixture: ComponentFixture<DialogDetalleReposicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetalleReposicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetalleReposicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
