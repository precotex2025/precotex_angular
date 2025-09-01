import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFirmaDigitalComponent } from './dialog-firma-digital.component';

describe('DialogFirmaDigitalComponent', () => {
  let component: DialogFirmaDigitalComponent;
  let fixture: ComponentFixture<DialogFirmaDigitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFirmaDigitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFirmaDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
