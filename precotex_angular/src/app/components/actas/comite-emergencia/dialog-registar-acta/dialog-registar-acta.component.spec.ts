import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistarActaComponent } from './dialog-registar-acta.component';

describe('DialogRegistarActaComponent', () => {
  let component: DialogRegistarActaComponent;
  let fixture: ComponentFixture<DialogRegistarActaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRegistarActaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRegistarActaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
