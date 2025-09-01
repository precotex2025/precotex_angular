import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoCheckListComponent } from './formato-check-list.component';

describe('FormatoCheckListComponent', () => {
  let component: FormatoCheckListComponent;
  let fixture: ComponentFixture<FormatoCheckListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormatoCheckListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoCheckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
