import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabriccardComponent } from './fabriccard.component';

describe('FabriccardComponent', () => {
  let component: FabriccardComponent;
  let fixture: ComponentFixture<FabriccardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FabriccardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FabriccardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
