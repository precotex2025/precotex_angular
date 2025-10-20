import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAreaNuevoComponent } from './dialog-area-nuevo.component';

describe('DialogAreaNuevoComponent', () => {
  let component: DialogAreaNuevoComponent;
  let fixture: ComponentFixture<DialogAreaNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAreaNuevoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAreaNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
