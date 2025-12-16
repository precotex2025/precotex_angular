import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaValesComponent } from './consulta-vales.component';

describe('ConsultaValesComponent', () => {
  let component: ConsultaValesComponent;
  let fixture: ComponentFixture<ConsultaValesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaValesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaValesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
