import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInvoiceComponent } from './dialog-invoice.component';

describe('DialogInvoiceComponent', () => {
  let component: DialogInvoiceComponent;
  let fixture: ComponentFixture<DialogInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
