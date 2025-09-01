import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CortesMedidasComponent } from './cortes-medidas.component';

describe('CortesMedidasComponent', () => {
  let component: CortesMedidasComponent;
  let fixture: ComponentFixture<CortesMedidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CortesMedidasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CortesMedidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
