import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCrearCheckComponent } from './dialog-crear-check.component';

describe('DialogCrearCheckComponent', () => {
  let component: DialogCrearCheckComponent;
  let fixture: ComponentFixture<DialogCrearCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCrearCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCrearCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
