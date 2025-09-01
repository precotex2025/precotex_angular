import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProgramacionAuditoriaReprogamaComponent } from './dialog-programacion-auditoria-reprogama.component';

describe('DialogProgramacionAuditoriaReprogamaComponent', () => {
  let component: DialogProgramacionAuditoriaReprogamaComponent;
  let fixture: ComponentFixture<DialogProgramacionAuditoriaReprogamaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogProgramacionAuditoriaReprogamaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogProgramacionAuditoriaReprogamaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
