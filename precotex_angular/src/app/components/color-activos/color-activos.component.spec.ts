import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorActivosComponent } from './color-activos.component';

describe('ColorActivosComponent', () => {
  let component: ColorActivosComponent;
  let fixture: ComponentFixture<ColorActivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorActivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorActivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
