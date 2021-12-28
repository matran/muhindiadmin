import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dialog-department',
  templateUrl: './dialog-department.component.html',
  styleUrls: ['./dialog-department.component.css']
})
export class DialogDepartmentComponent implements OnInit {
  department: any = {};
  action:string=""
  public event: EventEmitter<any> = new EventEmitter();
  departmentForm!: FormGroup;
  IsWait=false
  constructor(public bsModalRef: BsModalRef,public formBuilder: FormBuilder) {}
 
  ngOnInit() {
    this.departmentForm = this.formBuilder.group({
      name: ['', [Validators.required]]
    })  
    if(this.action=="Update"){
      this.departmentForm.controls['name'].setValue(this.department.name);
    }
  }
  
  doAction(): void {
    let department=this.departmentForm.value;
    if(this.action=="Update"){
      department.id=this.department.id
      this.event.emit({department});
    }else if(this.action=="Add")
    {
      this.event.emit({department});
    }
    this.bsModalRef.hide();
  }
 
  decline(): void {
    this.bsModalRef.hide();
  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.departmentForm.controls[controlName].hasError(errorName);
  }
  get getControl(){
    return this.departmentForm.controls;
  }

}
