import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMantMaquiHiComponent } from './dialog-mant-maqui-hi.component';

describe('DialogMantMaquiHiComponent', () => {
  let component: DialogMantMaquiHiComponent;
  let fixture: ComponentFixture<DialogMantMaquiHiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMantMaquiHiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMantMaquiHiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
