import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerRatioConsumoComponent } from './ver-ratio-consumo.component';

describe('VerRatioConsumoComponent', () => {
  let component: VerRatioConsumoComponent;
  let fixture: ComponentFixture<VerRatioConsumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerRatioConsumoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerRatioConsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
