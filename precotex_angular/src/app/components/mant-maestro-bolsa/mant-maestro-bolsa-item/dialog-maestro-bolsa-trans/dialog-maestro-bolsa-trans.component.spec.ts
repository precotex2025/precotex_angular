import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMaestroBolsaTransComponent } from './dialog-maestro-bolsa-trans.component';

describe('DialogMaestroBolsaTransComponent', () => {
  let component: DialogMaestroBolsaTransComponent;
  let fixture: ComponentFixture<DialogMaestroBolsaTransComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMaestroBolsaTransComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMaestroBolsaTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
