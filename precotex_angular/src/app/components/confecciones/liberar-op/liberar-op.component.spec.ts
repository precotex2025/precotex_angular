import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberarOpComponent } from './liberar-op.component';

describe('LiberarOpComponent', () => {
  let component: LiberarOpComponent;
  let fixture: ComponentFixture<LiberarOpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiberarOpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiberarOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
