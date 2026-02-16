import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoFacialComponent } from './reco-facial.component';

describe('RecoFacialComponent', () => {
  let component: RecoFacialComponent;
  let fixture: ComponentFixture<RecoFacialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoFacialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoFacialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
