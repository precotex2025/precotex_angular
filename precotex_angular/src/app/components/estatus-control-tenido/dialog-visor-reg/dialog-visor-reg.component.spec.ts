import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVisorRegComponent } from './dialog-visor-reg.component';

describe('DialogVisorImageComponent', () => {
  let component: DialogVisorRegComponent;
  let fixture: ComponentFixture<DialogVisorRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogVisorRegComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVisorRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
