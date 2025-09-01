import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HojaIngenieriaOperacionListComponent } from './hoja-ingenieria-operacion-list.component';

describe('HojaIngenieriaOperacionListComponent', () => {
  let component: HojaIngenieriaOperacionListComponent;
  let fixture: ComponentFixture<HojaIngenieriaOperacionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HojaIngenieriaOperacionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HojaIngenieriaOperacionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
