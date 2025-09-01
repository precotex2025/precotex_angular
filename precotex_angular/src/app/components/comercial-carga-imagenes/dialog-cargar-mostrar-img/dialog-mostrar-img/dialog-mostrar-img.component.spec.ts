import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMostrarImgComponent } from './dialog-mostrar-img.component';

describe('DialogMostrarImgComponent', () => {
  let component: DialogMostrarImgComponent;
  let fixture: ComponentFixture<DialogMostrarImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMostrarImgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMostrarImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
