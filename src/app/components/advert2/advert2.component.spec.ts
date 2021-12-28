import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Advert2Component } from './advert2.component';

describe('Advert2Component', () => {
  let component: Advert2Component;
  let fixture: ComponentFixture<Advert2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Advert2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Advert2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
