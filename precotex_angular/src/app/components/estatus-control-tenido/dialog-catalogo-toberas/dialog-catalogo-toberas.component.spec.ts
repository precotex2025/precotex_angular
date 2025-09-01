import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCatalogoToberasComponent } from './dialog-catalogo-toberas.component';

describe('DialogCatalogoToberasComponent', () => {
  let component: DialogCatalogoToberasComponent;
  let fixture: ComponentFixture<DialogCatalogoToberasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCatalogoToberasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCatalogoToberasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
