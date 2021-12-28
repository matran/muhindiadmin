import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSubcategoryComponent } from './dialog-subcategory.component';

describe('DialogSubcategoryComponent', () => {
  let component: DialogSubcategoryComponent;
  let fixture: ComponentFixture<DialogSubcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSubcategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
