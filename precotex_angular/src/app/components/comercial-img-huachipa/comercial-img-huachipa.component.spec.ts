import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercialImgHuachipaComponent } from './comercial-img-huachipa.component';

describe('ComercialImgHuachipaComponent', () => {
  let component: ComercialImgHuachipaComponent;
  let fixture: ComponentFixture<ComercialImgHuachipaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComercialImgHuachipaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercialImgHuachipaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
