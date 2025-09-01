import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaPreviaVaporizadoDefectosComponent } from './vista-previa-vaporizado-defectos.component';

describe('VistaPreviaVaporizadoDefectosComponent', () => {
  let component: VistaPreviaVaporizadoDefectosComponent;
  let fixture: ComponentFixture<VistaPreviaVaporizadoDefectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaPreviaVaporizadoDefectosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaPreviaVaporizadoDefectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
