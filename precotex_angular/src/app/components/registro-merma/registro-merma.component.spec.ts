import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroMermaComponent } from './registro-merma.component';

describe('RegistroMermaComponent', () => {
  let component: RegistroMermaComponent;
  let fixture: ComponentFixture<RegistroMermaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroMermaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroMermaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
