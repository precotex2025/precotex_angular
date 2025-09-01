import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPartidaParihuelaComponent } from './registro-partida-parihuela.component';

describe('RegistroPartidaParihuelaComponent', () => {
  let component: RegistroPartidaParihuelaComponent;
  let fixture: ComponentFixture<RegistroPartidaParihuelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroPartidaParihuelaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroPartidaParihuelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
