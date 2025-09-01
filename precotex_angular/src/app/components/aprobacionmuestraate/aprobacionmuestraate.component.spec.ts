import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobacionmuestraateComponent } from './aprobacionmuestraate.component';

describe('AprobacionmuestraateComponent', () => {
  let component: AprobacionmuestraateComponent;
  let fixture: ComponentFixture<AprobacionmuestraateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobacionmuestraateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobacionmuestraateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
