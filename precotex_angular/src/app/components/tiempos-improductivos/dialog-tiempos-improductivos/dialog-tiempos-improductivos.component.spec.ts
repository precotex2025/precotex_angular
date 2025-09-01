import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTiemposImproductivosComponent } from './dialog-tiempos-improductivos.component';

describe('DialogTiemposImproductivosComponent', () => {
  let component: DialogTiemposImproductivosComponent;
  let fixture: ComponentFixture<DialogTiemposImproductivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogTiemposImproductivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTiemposImproductivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
