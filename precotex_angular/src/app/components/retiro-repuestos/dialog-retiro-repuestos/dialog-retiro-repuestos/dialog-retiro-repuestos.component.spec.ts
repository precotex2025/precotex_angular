import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRetiroRepuestosComponent } from './dialog-retiro-repuestos.component';

describe('DialogRetiroRepuestosComponent', () => {
  let component: DialogRetiroRepuestosComponent;
  let fixture: ComponentFixture<DialogRetiroRepuestosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRetiroRepuestosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRetiroRepuestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
