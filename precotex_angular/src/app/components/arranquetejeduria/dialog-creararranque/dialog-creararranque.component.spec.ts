import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreararranqueComponent } from './dialog-creararranque.component';

describe('DialogCreararranqueComponent', () => {
  let component: DialogCreararranqueComponent;
  let fixture: ComponentFixture<DialogCreararranqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreararranqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreararranqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
