import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturaRergistroQreComponent } from './lectura-rergistro-qre.component';

describe('LecturaRergistroQreComponent', () => {
  let component: LecturaRergistroQreComponent;
  let fixture: ComponentFixture<LecturaRergistroQreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LecturaRergistroQreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturaRergistroQreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
