import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAprobRechOpComponent } from './dialog-aprob-rech-op.component';

describe('DialogAprobRechOpComponent', () => {
  let component: DialogAprobRechOpComponent;
  let fixture: ComponentFixture<DialogAprobRechOpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAprobRechOpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAprobRechOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
