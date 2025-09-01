import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCuatroPuntosComponent } from './dialog-cuatro-puntos.component';

describe('DialogCuatroPuntosComponent', () => {
  let component: DialogCuatroPuntosComponent;
  let fixture: ComponentFixture<DialogCuatroPuntosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCuatroPuntosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCuatroPuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
