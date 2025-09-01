import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobControlInternoComponent } from './aprob-control-interno.component';

describe('AprobControlInternoComponent', () => {
  let component: AprobControlInternoComponent;
  let fixture: ComponentFixture<AprobControlInternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobControlInternoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobControlInternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
