import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-dialog-location',
  templateUrl: './dialog-location.component.html',
  styleUrls: ['./dialog-location.component.css']
})
export class DialogLocationComponent implements OnInit {
  location: any = {};
  action:string=""
  public event: EventEmitter<any> = new EventEmitter();
  locationForm!: FormGroup;
  IsWait=false
  constructor(public bsModalRef: BsModalRef,public formBuilder: FormBuilder) {}
 
  ngOnInit() {
    this.locationForm = this.formBuilder.group({
      location: ['', [Validators.required]],
      price: ['', [Validators.required]]
    })  
    if(this.action=="Update"){
      this.locationForm.controls['location'].setValue(this.location.location);
      this.locationForm.controls['price'].setValue(this.location.price);
    }

  }
  
  doAction(): void {
    let location=this.locationForm.value;
    if(this.action=="Update"){
      location.id=this.location.id
      this.event.emit({location});
    }else if(this.action=="Add")
    {
      this.event.emit({location});
    }
    this.bsModalRef.hide();
  }
 
  decline(): void {
    this.bsModalRef.hide();
  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.locationForm.controls[controlName].hasError(errorName);
  }
  get getControl(){
    return this.locationForm.controls;
  }

}
