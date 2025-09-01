import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModificararranqueComponent } from './dialog-modificararranque.component';

describe('DialogModificararranqueComponent', () => {
  let component: DialogModificararranqueComponent;
  let fixture: ComponentFixture<DialogModificararranqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogModificararranqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogModificararranqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
