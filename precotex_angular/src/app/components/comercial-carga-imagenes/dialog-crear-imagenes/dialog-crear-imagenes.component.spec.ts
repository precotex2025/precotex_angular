import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCrearImagenesComponent } from './dialog-crear-imagenes.component';

describe('DialogCrearImagenesComponent', () => {
  let component: DialogCrearImagenesComponent;
  let fixture: ComponentFixture<DialogCrearImagenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCrearImagenesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCrearImagenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
