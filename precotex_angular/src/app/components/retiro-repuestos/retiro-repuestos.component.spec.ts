import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetiroRepuestosComponent } from './retiro-repuestos.component';

describe('RetiroRepuestosComponent', () => {
  let component: RetiroRepuestosComponent;
  let fixture: ComponentFixture<RetiroRepuestosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetiroRepuestosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetiroRepuestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
