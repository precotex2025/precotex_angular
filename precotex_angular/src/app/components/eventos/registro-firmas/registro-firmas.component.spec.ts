import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroFirmasComponent } from './registro-firmas.component';

describe('RegistroFirmasComponent', () => {
  let component: RegistroFirmasComponent;
  let fixture: ComponentFixture<RegistroFirmasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroFirmasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroFirmasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
