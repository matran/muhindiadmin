import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.css']
})
export class DialogConfirmComponent implements OnInit {
  product: any = {};
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
    //this.list.push('PROFIT!!!');
  }
  
  confirm(id:string): void {
    this.event.emit({ id: id});
    this.bsModalRef.hide();
  }
 
  decline(): void {
    this.bsModalRef.hide();
  }

}
