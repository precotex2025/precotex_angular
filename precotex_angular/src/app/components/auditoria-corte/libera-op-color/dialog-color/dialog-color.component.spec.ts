import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogColorComponent } from './dialog-color.component';

describe('DialogColorComponent', () => {
  let component: DialogColorComponent;
  let fixture: ComponentFixture<DialogColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogColorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
