import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCrearRolWebComponent } from './dialog-crear-rol-web.component';

describe('DialogCrearRolWebComponent', () => {
  let component: DialogCrearRolWebComponent;
  let fixture: ComponentFixture<DialogCrearRolWebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCrearRolWebComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCrearRolWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
