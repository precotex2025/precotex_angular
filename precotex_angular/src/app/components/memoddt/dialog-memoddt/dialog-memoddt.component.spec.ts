import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMemoddtComponent } from './dialog-memoddt.component';

describe('DialogMemoddtComponent', () => {
  let component: DialogMemoddtComponent;
  let fixture: ComponentFixture<DialogMemoddtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMemoddtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMemoddtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
