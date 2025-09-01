import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArranquetejeduriaComponent } from './arranquetejeduria.component';

describe('ArranquetejeduriaComponent', () => {
  let component: ArranquetejeduriaComponent;
  let fixture: ComponentFixture<ArranquetejeduriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArranquetejeduriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArranquetejeduriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
