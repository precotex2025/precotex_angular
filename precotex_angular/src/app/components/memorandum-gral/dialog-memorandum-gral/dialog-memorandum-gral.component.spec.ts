import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMemorandumGralComponent } from './dialog-memorandum-gral.component';

describe('DialogMemorandumGralComponent', () => {
  let component: DialogMemorandumGralComponent;
  let fixture: ComponentFixture<DialogMemorandumGralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMemorandumGralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMemorandumGralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
