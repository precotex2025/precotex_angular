import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProduccionArtesCrearComponent } from './dialog-produccion-artes-crear.component';

describe('DialogProduccionArtesCrearComponent', () => {
  let component: DialogProduccionArtesCrearComponent;
  let fixture: ComponentFixture<DialogProduccionArtesCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogProduccionArtesCrearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogProduccionArtesCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
