import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistroFirmasComponent } from './dialog-registro-firmas.component';

describe('DialogRegistroFirmasComponent', () => {
  let component: DialogRegistroFirmasComponent;
  let fixture: ComponentFixture<DialogRegistroFirmasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRegistroFirmasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRegistroFirmasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
