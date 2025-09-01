import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberaOpColorComponent } from './libera-op-color.component';

describe('LiberaOpColorComponent', () => {
  let component: LiberaOpColorComponent;
  let fixture: ComponentFixture<LiberaOpColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiberaOpColorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiberaOpColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
