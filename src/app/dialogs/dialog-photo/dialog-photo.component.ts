import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dialog-photo',
  templateUrl: './dialog-photo.component.html',
  styleUrls: ['./dialog-photo.component.css']
})
export class DialogPhotoComponent implements OnInit {
  image: any = {};
  public event: EventEmitter<any> = new EventEmitter();
  photoForm!: FormGroup;
  IsWait=false
  constructor(public bsModalRef: BsModalRef,public formBuilder: FormBuilder) {}
  ngOnInit() {
    this.photoForm = this.formBuilder.group({
      category: ['', [Validators.required]]
    })  
 this.photoForm.controls['category'].setValue(this.image.imagetype);  
  }
  
  doAction(): void {
    let image=this.photoForm.value;
    image.id=this.image.id
    this.event.emit({image});
    this.bsModalRef.hide();
  }
 
  decline(): void {
    this.bsModalRef.hide();
  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.photoForm.controls[controlName].hasError(errorName);
  }
  get getControl(){
    return this.photoForm.controls;
  }

}
