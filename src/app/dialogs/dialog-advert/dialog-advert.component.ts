import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-dialog-advert',
  templateUrl: './dialog-advert.component.html',
  styleUrls: ['./dialog-advert.component.css']
})
export class DialogAdvertComponent implements OnInit {
  public Editor=ClassicEditor;
  advert: any = {};
  action:string=""
  public event: EventEmitter<any> = new EventEmitter();
  advertForm!: FormGroup;
  selectedFile:any=null
  IsWait=false
  constructor(public bsModalRef: BsModalRef,public formBuilder: FormBuilder) {}
 
  ngOnInit() {
    if(this.action =="Add"){
    this.advertForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      notes: ['', [Validators.required]],
      photo: ['', [Validators.required]],
      link: ['', [Validators.required]],
      section: ['', [Validators.required]]
    })  
  }else if(this.action=="Update"){
    this.advertForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      notes: ['', [Validators.required]],
      photo: ['', []],
      link: ['', [Validators.required]],
      section: ['', [Validators.required]]
    }) 
      this.advertForm.controls['section'].setValue(this.advert.section);
      this.advertForm.controls['title'].setValue(this.advert.title);
      this.advertForm.controls['notes'].setValue(this.advert.notes);
      this.advertForm.controls['link'].setValue(this.advert.link);
    }
  }

  selectFile(event: any): void {
    this.selectedFile =<File>event.target.files[0];
  }
  
  doAction(): void {
    let advert=this.advertForm.value;
    advert.image=this.selectedFile
    if(this.action=="Update"){
      advert.id=this.advert.id
      this.event.emit({advert});
    }else if(this.action=="Add")
    {
      this.event.emit({advert});
    }
    this.bsModalRef.hide();
  }
 
  decline(): void {
    this.bsModalRef.hide();
  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.advertForm.controls[controlName].hasError(errorName);
  }
  get getControl(){
    return this.advertForm.controls;
  }

}
