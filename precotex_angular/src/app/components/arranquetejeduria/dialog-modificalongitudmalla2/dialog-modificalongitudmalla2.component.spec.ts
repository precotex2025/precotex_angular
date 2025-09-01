import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModificalongitudmalla2Component } from './dialog-modificalongitudmalla2.component';

describe('DialogModificalongitudmalla2Component', () => {
  let component: DialogModificalongitudmalla2Component;
  let fixture: ComponentFixture<DialogModificalongitudmalla2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogModificalongitudmalla2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogModificalongitudmalla2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
