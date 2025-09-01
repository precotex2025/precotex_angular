import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVisorPdfComponent } from './dialog-visor-pdf.component';

describe('DialogVisorPdfComponent', () => {
  let component: DialogVisorPdfComponent;
  let fixture: ComponentFixture<DialogVisorPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogVisorPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVisorPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
