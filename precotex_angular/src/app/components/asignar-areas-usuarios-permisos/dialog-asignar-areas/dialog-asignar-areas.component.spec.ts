import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAsignarAreasComponent } from './dialog-asignar-areas.component';

describe('DialogAsignarAreasComponent', () => {
  let component: DialogAsignarAreasComponent;
  let fixture: ComponentFixture<DialogAsignarAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAsignarAreasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAsignarAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
