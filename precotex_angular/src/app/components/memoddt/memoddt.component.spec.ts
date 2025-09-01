import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoddtComponent } from './memoddt.component';

describe('MemoddtComponent', () => {
  let component: MemoddtComponent;
  let fixture: ComponentFixture<MemoddtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemoddtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoddtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
