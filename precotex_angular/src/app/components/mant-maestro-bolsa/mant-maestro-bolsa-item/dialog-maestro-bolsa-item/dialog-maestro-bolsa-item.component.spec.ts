import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMaestroBolsaItemComponent } from './dialog-maestro-bolsa-item.component';

describe('DialogMaestroBolsaItemComponent', () => {
  let component: DialogMaestroBolsaItemComponent;
  let fixture: ComponentFixture<DialogMaestroBolsaItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMaestroBolsaItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMaestroBolsaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
