import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturaRolloDespachoComponent } from './lectura-rollo-despacho.component';

describe('LecturaRolloDespachoComponent', () => {
  let component: LecturaRolloDespachoComponent;
  let fixture: ComponentFixture<LecturaRolloDespachoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LecturaRolloDespachoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturaRolloDespachoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
