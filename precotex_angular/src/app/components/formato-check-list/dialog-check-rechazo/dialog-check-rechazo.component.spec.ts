import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCheckRechazoComponent } from './dialog-check-rechazo.component';

describe('DialogCheckRechazoComponent', () => {
  let component: DialogCheckRechazoComponent;
  let fixture: ComponentFixture<DialogCheckRechazoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCheckRechazoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCheckRechazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
