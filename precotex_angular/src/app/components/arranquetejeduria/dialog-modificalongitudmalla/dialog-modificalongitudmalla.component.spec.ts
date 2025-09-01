import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModificalongitudmallaComponent } from './dialog-modificalongitudmalla.component';

describe('DialogModificalongitudmallaComponent', () => {
  let component: DialogModificalongitudmallaComponent;
  let fixture: ComponentFixture<DialogModificalongitudmallaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogModificalongitudmallaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogModificalongitudmallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
