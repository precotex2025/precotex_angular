import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPartidaParihuelaV2Component } from './registro-partida-parihuela-v2.component';

describe('RegistroPartidaParihuelaV2Component', () => {
  let component: RegistroPartidaParihuelaV2Component;
  let fixture: ComponentFixture<RegistroPartidaParihuelaV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroPartidaParihuelaV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroPartidaParihuelaV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
