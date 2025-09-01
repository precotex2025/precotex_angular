import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroParaMaqTinto } from './registro-paramaq-tinto';


describe('LecturaBultosAlmacenComponent', () => {
  let component: RegistroParaMaqTinto;
  let fixture: ComponentFixture<RegistroParaMaqTinto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroParaMaqTinto ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroParaMaqTinto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
