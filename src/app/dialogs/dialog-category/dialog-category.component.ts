import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DepartmentService } from 'src/app/services/department.service';
@Component({
  selector: 'app-dialog-category',
  templateUrl: './dialog-category.component.html',
  styleUrls: ['./dialog-category.component.css']
})
export class DialogCategoryComponent implements OnInit {
  category: any = {};
  categories:any[]=[]
  action:string=""
  public event: EventEmitter<any> = new EventEmitter();
  categoryForm!: FormGroup;
  IsWait=false
  constructor(private departmentService:DepartmentService, public bsModalRef: BsModalRef,public formBuilder: FormBuilder) {}
 
  ngOnInit() {
    this.categoryForm = this.formBuilder.group({
      department: ['', [Validators.required]],
      name: ['', [Validators.required]]
    })  
    if(this.action=="Update"){
      this.categoryForm.controls['department'].setValue(this.category.parent);
      this.categoryForm.controls['name'].setValue(this.category.name);
    }
    this.departmentService.getData().pipe(
      catchError(err => of([]))
        ).subscribe(data => {
            this.categories =  data;
          })
  }
  
  doAction(): void {
    let category=this.categoryForm.value;
    if(this.action=="Update"){
      category.id=this.category.id
      this.event.emit({category});
    }else if(this.action=="Add")
    {
      this.event.emit({category});
    }
    this.bsModalRef.hide();
  }
 
  decline(): void {
    this.bsModalRef.hide();
  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.categoryForm.controls[controlName].hasError(errorName);
  }
  get getControl(){
    return this.categoryForm.controls;
  }
}
