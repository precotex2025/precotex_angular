import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModificaMantMaquiHiComponent } from './dialog-modifica-mant-maqui-hi.component';

describe('DialogModificaMantMaquiHiComponent', () => {
  let component: DialogModificaMantMaquiHiComponent;
  let fixture: ComponentFixture<DialogModificaMantMaquiHiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogModificaMantMaquiHiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogModificaMantMaquiHiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
