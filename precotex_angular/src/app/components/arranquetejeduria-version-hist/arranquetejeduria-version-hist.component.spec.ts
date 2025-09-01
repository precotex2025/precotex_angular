import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArranquetejeduriaVersionHistComponent } from './arranquetejeduria-version-hist.component';

describe('ArranquetejeduriaVersionHistComponent', () => {
  let component: ArranquetejeduriaVersionHistComponent;
  let fixture: ComponentFixture<ArranquetejeduriaVersionHistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArranquetejeduriaVersionHistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArranquetejeduriaVersionHistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
