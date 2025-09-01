import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizarDespachoComponent } from './realizar-despacho.component';

describe('RealizarDespachoComponent', () => {
  let component: RealizarDespachoComponent;
  let fixture: ComponentFixture<RealizarDespachoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealizarDespachoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealizarDespachoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
