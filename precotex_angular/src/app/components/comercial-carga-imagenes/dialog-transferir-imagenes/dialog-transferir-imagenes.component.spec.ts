import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTransferirImagenesComponent } from './dialog-transferir-imagenes.component';

describe('DialogTransferirImagenesComponent', () => {
  let component: DialogTransferirImagenesComponent;
  let fixture: ComponentFixture<DialogTransferirImagenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogTransferirImagenesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTransferirImagenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
