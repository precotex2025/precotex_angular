import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMemorandumGralEditComponent } from './dialog-memorandum-gral-edit.component';

describe('DialogMemorandumGralEditComponent', () => {
  let component: DialogMemorandumGralEditComponent;
  let fixture: ComponentFixture<DialogMemorandumGralEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMemorandumGralEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMemorandumGralEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
