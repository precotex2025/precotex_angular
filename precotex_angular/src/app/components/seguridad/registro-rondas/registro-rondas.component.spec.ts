import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroRondasComponent } from './registro-rondas.component';

describe('RegistroRondasComponent', () => {
  let component: RegistroRondasComponent;
  let fixture: ComponentFixture<RegistroRondasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroRondasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroRondasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
