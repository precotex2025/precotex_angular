import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSelectUsuarioComponent } from './dialog-select-usuario.component';

describe('DialogSelectUsuarioComponent', () => {
  let component: DialogSelectUsuarioComponent;
  let fixture: ComponentFixture<DialogSelectUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSelectUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSelectUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
