import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialigDefectosAuditoriaComponent } from './dialig-defectos-auditoria.component';

describe('DialigDefectosAuditoriaComponent', () => {
  let component: DialigDefectosAuditoriaComponent;
  let fixture: ComponentFixture<DialigDefectosAuditoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialigDefectosAuditoriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialigDefectosAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
