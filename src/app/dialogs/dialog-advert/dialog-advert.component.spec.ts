import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAdvertComponent } from './dialog-advert.component';

describe('DialogAdvertComponent', () => {
  let component: DialogAdvertComponent;
  let fixture: ComponentFixture<DialogAdvertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAdvertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAdvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
