import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCheckOpComponent } from './dialog-check-op.component';

describe('DialogCheckOpComponent', () => {
  let component: DialogCheckOpComponent;
  let fixture: ComponentFixture<DialogCheckOpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCheckOpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCheckOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
