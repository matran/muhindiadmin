import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dialog-invoice',
  templateUrl: './dialog-invoice.component.html',
  styleUrls: ['./dialog-invoice.component.css']
})
export class DialogInvoiceComponent implements OnInit {
  order: any = {}
  cart:any=[]
  constructor(public bsModalRef: BsModalRef) { }
  ngOnInit(): void {
    this.cart=JSON.parse(this.order.cart)
  }

  decline(): void {
    this.bsModalRef.hide();
  }

  print(){
    var printContents = document.getElementById("invoice_print")!.innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    location.reload()
  }

}
