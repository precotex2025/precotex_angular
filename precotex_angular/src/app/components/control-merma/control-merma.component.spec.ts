import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlMermaComponent } from './control-merma.component';

describe('ControlMermaComponent', () => {
  let component: ControlMermaComponent;
  let fixture: ComponentFixture<ControlMermaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlMermaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlMermaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
