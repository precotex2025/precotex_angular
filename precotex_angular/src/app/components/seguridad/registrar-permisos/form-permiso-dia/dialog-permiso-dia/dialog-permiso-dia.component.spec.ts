import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPermisoDiaComponent } from './dialog-permiso-dia.component';

describe('DialogPermisoDiaComponent', () => {
  let component: DialogPermisoDiaComponent;
  let fixture: ComponentFixture<DialogPermisoDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPermisoDiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPermisoDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
