import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCombinacionComponent } from './dialog-combinacion.component';

describe('DialogCombinacionComponent', () => {
  let component: DialogCombinacionComponent;
  let fixture: ComponentFixture<DialogCombinacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCombinacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCombinacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
