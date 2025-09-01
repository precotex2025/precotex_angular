import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAuditoriaExternoComponent } from './dialog-auditoria-externo.component';

describe('DialogAuditoriaExternoComponent', () => {
  let component: DialogAuditoriaExternoComponent;
  let fixture: ComponentFixture<DialogAuditoriaExternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAuditoriaExternoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAuditoriaExternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
