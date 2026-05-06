import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturaBultosDetComponent } from './lectura-bultos-det.component';

describe('LecturaBultosDetComponent', () => {
  let component: LecturaBultosDetComponent;
  let fixture: ComponentFixture<LecturaBultosDetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LecturaBultosDetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturaBultosDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
