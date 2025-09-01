import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemorandumGralComponent } from './memorandum-gral.component';

describe('MemorandumGralComponent', () => {
  let component: MemorandumGralComponent;
  let fixture: ComponentFixture<MemorandumGralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemorandumGralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemorandumGralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
