import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUbicacionRegistrarComponent } from './dialog-ubicacion-registrar.component';

describe('DialogUbicacionRegistrarComponent', () => {
  let component: DialogUbicacionRegistrarComponent;
  let fixture: ComponentFixture<DialogUbicacionRegistrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUbicacionRegistrarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUbicacionRegistrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
