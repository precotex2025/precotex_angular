import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLecturaBultosComponent } from './dialog-lectura-bultos.component';

describe('DialogLecturaBultosComponent', () => {
  let component: DialogLecturaBultosComponent;
  let fixture: ComponentFixture<DialogLecturaBultosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogLecturaBultosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLecturaBultosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
