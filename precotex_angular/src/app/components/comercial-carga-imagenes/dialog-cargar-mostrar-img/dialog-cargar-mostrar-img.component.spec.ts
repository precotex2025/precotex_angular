import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCargarMostrarImgComponent } from './dialog-cargar-mostrar-img.component';

describe('DialogCargarMostrarImgComponent', () => {
  let component: DialogCargarMostrarImgComponent;
  let fixture: ComponentFixture<DialogCargarMostrarImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCargarMostrarImgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCargarMostrarImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
