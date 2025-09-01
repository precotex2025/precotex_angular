import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVisorImageComponent } from './dialog-visor-image.component';

describe('DialogVisorImageComponent', () => {
  let component: DialogVisorImageComponent;
  let fixture: ComponentFixture<DialogVisorImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogVisorImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVisorImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
