import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRecepFabriccardComponent } from './dialog-recep-fabriccard.component';

describe('DialogRecepFabriccardComponent', () => {
  let component: DialogRecepFabriccardComponent;
  let fixture: ComponentFixture<DialogRecepFabriccardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRecepFabriccardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRecepFabriccardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
