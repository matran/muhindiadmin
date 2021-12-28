import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-dialog-subcategory',
  templateUrl: './dialog-subcategory.component.html',
  styleUrls: ['./dialog-subcategory.component.css']
})
export class DialogSubcategoryComponent implements OnInit {
  subcategory: any = {};
  categories:any[]=[]
  action:string=""
  public event: EventEmitter<any> = new EventEmitter();
  subcategoryForm!: FormGroup;
  IsWait=false
  constructor(private categoryService:CategoryService, public bsModalRef: BsModalRef,public formBuilder: FormBuilder) {}
  ngOnInit() {
    this.subcategoryForm = this.formBuilder.group({
      category: ['', [Validators.required]],
      name: ['', [Validators.required]]
    })  
    if(this.action=="Update"){
      this.subcategoryForm.controls['category'].setValue(this.subcategory.parent);
      this.subcategoryForm.controls['name'].setValue(this.subcategory.name);
    }
    this.categoryService.getData().pipe(
      catchError(err => of([]))
        ).subscribe(data => {
            this.categories =  data;
          })
  }
  
  doAction(): void {
    let subcategory=this.subcategoryForm.value;
    if(this.action=="Update"){
      subcategory.id=this.subcategory.id
      this.event.emit({subcategory});
    }else if(this.action=="Add")
    {
      this.event.emit({subcategory});
    }
    this.bsModalRef.hide();
  }
 
  decline(): void {
    this.bsModalRef.hide();
  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.subcategoryForm.controls[controlName].hasError(errorName);
  }
  get getControl(){
    return this.subcategoryForm.controls;
  }
}
