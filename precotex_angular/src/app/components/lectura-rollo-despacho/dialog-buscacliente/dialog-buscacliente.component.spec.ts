import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBuscaclienteComponent } from './dialog-buscacliente.component';


describe('DialogBuscaclienteComponent', () => {
  let component: DialogBuscaclienteComponent;
  let fixture: ComponentFixture<DialogBuscaclienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogBuscaclienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBuscaclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
