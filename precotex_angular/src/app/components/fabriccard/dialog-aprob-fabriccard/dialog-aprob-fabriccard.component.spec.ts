import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAprobFabriccardComponent } from './dialog-aprob-fabriccard.component';

describe('DialogAprobFabriccardComponent', () => {
  let component: DialogAprobFabriccardComponent;
  let fixture: ComponentFixture<DialogAprobFabriccardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAprobFabriccardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAprobFabriccardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
