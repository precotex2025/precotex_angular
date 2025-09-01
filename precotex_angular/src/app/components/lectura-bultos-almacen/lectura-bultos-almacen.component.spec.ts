import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturaBultosAlmacenComponent } from './lectura-bultos-almacen.component';

describe('LecturaBultosAlmacenComponent', () => {
  let component: LecturaBultosAlmacenComponent;
  let fixture: ComponentFixture<LecturaBultosAlmacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LecturaBultosAlmacenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturaBultosAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
