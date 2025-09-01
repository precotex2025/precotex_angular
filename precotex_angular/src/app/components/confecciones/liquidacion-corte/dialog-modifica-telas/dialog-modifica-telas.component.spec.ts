import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModificaTelasComponent } from './dialog-modifica-telas.component';

describe('DialogModificaTelasComponent', () => {
  let component: DialogModificaTelasComponent;
  let fixture: ComponentFixture<DialogModificaTelasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogModificaTelasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogModificaTelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
