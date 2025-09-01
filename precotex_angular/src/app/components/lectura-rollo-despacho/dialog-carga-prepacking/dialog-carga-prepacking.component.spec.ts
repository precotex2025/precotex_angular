import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCargaPrepackingComponent } from './dialog-carga-prepacking.component';

describe('DialogCargaPrepackingComponent', () => {
  let component: DialogCargaPrepackingComponent;
  let fixture: ComponentFixture<DialogCargaPrepackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCargaPrepackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCargaPrepackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
