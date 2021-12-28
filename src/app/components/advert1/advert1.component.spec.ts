import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Advert1Component } from './advert1.component';

describe('Advert1Component', () => {
  let component: Advert1Component;
  let fixture: ComponentFixture<Advert1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Advert1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Advert1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
