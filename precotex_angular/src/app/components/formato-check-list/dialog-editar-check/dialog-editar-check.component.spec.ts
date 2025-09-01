import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditarCheckComponent } from './dialog-editar-check.component';

describe('DialogEditarCheckComponent', () => {
  let component: DialogEditarCheckComponent;
  let fixture: ComponentFixture<DialogEditarCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditarCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditarCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
