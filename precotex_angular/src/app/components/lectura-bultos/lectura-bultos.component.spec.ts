import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturaBultosComponent } from './lectura-bultos.component';

describe('LecturaBultosComponent', () => {
  let component: LecturaBultosComponent;
  let fixture: ComponentFixture<LecturaBultosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LecturaBultosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturaBultosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
