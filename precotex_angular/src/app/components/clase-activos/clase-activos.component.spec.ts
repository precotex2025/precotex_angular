import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaseActivosComponent } from './clase-activos.component';

describe('ClaseActivosComponent', () => {
  let component: ClaseActivosComponent;
  let fixture: ComponentFixture<ClaseActivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaseActivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaseActivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
