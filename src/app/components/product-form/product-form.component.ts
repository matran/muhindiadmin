import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxIzitoastService } from 'ngx-izitoast';
import { Observable, of } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { DialogPhotoComponent } from 'src/app/dialogs/dialog-photo/dialog-photo.component';
import { Product } from 'src/app/models/product';
import { ProductImage } from 'src/app/models/product-image';
import { CategoryService } from 'src/app/services/category.service';
import { DepartmentService } from 'src/app/services/department.service';
import { ProductService } from 'src/app/services/product.service';
import { SubcategoryService } from 'src/app/services/subcategory.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UploadAdapter } from 'src/app/models/upload-adapter';
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  public Editor=ClassicEditor;
  editorConfig = {

    placeholder: 'Type here..',
 
  };
  subcategories:any[]=[]
  categories:any[]=[]
  departments:any[]=[]
  response:any;
  id:string=""
  productForm!: FormGroup;
  action="Add"
  IsWait=false
  fileWait=false
  showAddButton=true
  selectedFiles?: FileList
  currentFile?: File
  progress = 0
  fileInfos?: Observable<any>
  local_data:any
  uploadbtntext="Upload Photo"
  bsModalRef!: BsModalRef;
  showDepartment=true
  showCategory=true
  showSubCategory=true
  oneSelected=false
  selectChanged=false
  constructor(public modalService: BsModalService,public iziToast: NgxIzitoastService,private departmentService:DepartmentService,  private categoryService:CategoryService, private subcategoryService : SubcategoryService,private productService: ProductService,public formBuilder: FormBuilder) { }
  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      sku:['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      details: ['', []],
      subcategory: ['', []],
      category:['',[]],
      department:['',[]],
      price: ['', [Validators.required]],
      promoprice:['',[]],
      quantity: ['', [Validators.required]]
    })  
    this.subcategoryService.getData().pipe(
      catchError(err => of([]))
        ).subscribe(data => {
            this.subcategories =  data;
      })

      this.categoryService.getData().pipe(
        catchError(err => of([]))
          ).subscribe(data => {
              this.categories =  data;
        })

        this.departmentService.getData().pipe(
          catchError(err => of([]))
            ).subscribe(data => {
                this.departments=  data;
          })
          if(history.state.action!=undefined){
            this.action="Update"
            this.uploadbtntext="Add New Photo"
            this.local_data=history.state.data
            this.productForm.controls['name'].setValue(this.local_data.name);
            this.productForm.controls['subcategory'].setValue(this.local_data.subcategory);
            this.productForm.controls['category'].setValue(this.local_data.category);
            this.productForm.controls['department'].setValue(this.local_data.department);
            this.productForm.controls['description'].setValue(this.local_data.description);
            this.productForm.controls['sku'].setValue(this.local_data.sku);
            this.productForm.controls['details'].setValue(this.local_data.details);
            this.productForm.controls['quantity'].setValue(this.local_data.quantity);
            this.productForm.controls['price'].setValue(this.local_data.price);
            this.productForm.controls['promoprice'].setValue(this.local_data.offerprice);
            this.fileInfos = this.productService.getImages(this.local_data.id);
            this.oneSelected=true
          }

      
          
  }





  categoryChange(type:any){
    this.oneSelected=true
    this.selectChanged=true
    if(type =='department'){
     this.showCategory=false
     this.showSubCategory=false
    }else if(type =='category'){
      this.showSubCategory=false
      this.showDepartment=false
    }else if(type == 'subcategory'){
      this.showDepartment=false
      this.showCategory=false
    }
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.productForm.controls[controlName].hasError(errorName);
  }

  get getControl(){
    return this.productForm.controls;
  }

doAction(){
  let product=this.productForm.value;
  console.log(product)
  if(this.action=="Add"){
   this.saveData(product)
  }else if(this.action=="Update"){
    this.updateData(product)
  }

}

  updateData(data:any){
    this.IsWait=true
      this.showAddButton=false
    let product=new Product()
    product.id=this.local_data.id
    product.sku=data.sku
    product.name=data.name
    product.description=data.description
    product.details=data.details
    product.offerprice=data.promoprice
    if(this.selectChanged == true){
    if(this.showCategory){
      product.category=data.category
      product.type='category'
    }else if(this.showDepartment){
      product.department=data.department
      product.type='department'
    }else if(this.showSubCategory){
      product.subcategory=data.subcategory
      product.type='subcategory'
    } 
   }
    product.price=data.price
    product.quantity=data.quantity
    this.productService.updateData(product).pipe(
      catchError(err => of(this.showFailMessage(err)))).subscribe(results => {
        this.IsWait=false
        this.showAddButton=true
      this.response=results;
      if(this.response.status=='success'){
        this.showSuccessMessage("Updated successfully")
        
      }else{
        this.showFailMessage("Unable to Save. Internet connection error")
      }
    })
  }
  
      saveData(data:any){
      this.IsWait=true
      this.showAddButton=false
      let product=new Product()
      product.sku=data.sku
      product.name=data.name
      product.description=data.description
      product.details=data.details
      product.offerprice=data.promoprice
      if(this.showCategory){
        product.category=data.category
        product.type='category'
      }else if(this.showDepartment){
        product.department=data.department
        product.type='department'
      }else if(this.showSubCategory){
        product.subcategory=data.subcategory
        product.type='subcategory'
      } 
      product.price=data.price
      product.quantity=data.quantity 
      this.productService.saveData(product).pipe(
        catchError(err => of(this.showFailMessage(err)))).subscribe(results => {
        this.IsWait=false
        this.showAddButton=true
        this.response=results
        if(this.response.status=='success'){
          this.productForm.reset()
           this.showSuccessMessage("Saved successfully")
        }else{
         this.showFailMessage("Unable to Save. Internet connection error")
        }
      });
  }
  showSuccessMessage(message:string){
    this.iziToast.success({
      title: 'Successful',
      message: message,
      position: 'bottomCenter' 
    });
  }

  showFailMessage(message:string){
    this.iziToast.error({
      title: 'Failed',
      message: message,
      position: 'bottomCenter' 
    });
  }
  showInfoMessage(message:string){
    this.iziToast.info({
      title: 'Info',
      message: message,
      position: 'topRight'
    });
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.showAddButton=false
  }


  selectMethodForSaving(){
    this.fileWait=true
    if(this.action=="Add"){
      this.saveDataWithImage()
    }else if(this.action=="Update"){
      this.updateDataWithImage()
    }
  }

  updateDataWithImage(){
  
    this.showAddButton=false
    let product=this.productForm.value;
    this.progress = 0;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        let formData=new FormData()
        formData.append('file', file);
        formData.append('id', this.local_data.id);
        formData.append('sku',product.sku)
        formData.append('name',product.name)
        formData.append('description',product.description)
        formData.append('details',product.details)
        formData.append('offerprice',product.promoprice)
        if(this.selectChanged == true){
           if(this.showCategory){
          formData.append('category',product.category)
          formData.append('type','category')
          }else if(this.showDepartment){
          formData.append('department',product.department)
          formData.append('type','department')
          }else if(this.showSubCategory){
          formData.append('subcategory',product.subcategory)
          formData.append('type','subcategory')
          }
        }
        formData.append('quantity',product.quantity)
        formData.append('price',product.price)
        this.productService.updateWithImage(formData).pipe(
          catchError(err => of(this.showFailMessage(err)))).subscribe((event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              break;
            case HttpEventType.ResponseHeader:
              break;
            case HttpEventType.UploadProgress:
              if(event.total){
              const total: number = event.total; 
              this.progress = Math.round(event.loaded / total * 100);
              }
              break;
            case HttpEventType.Response:
              if(event.body.status=="success"){              
                this.showSuccessMessage("successfully saved data")
                this.fileInfos = this.productService.getImages(this.local_data.id);
              }else if(event.body.status=="fail"){
                this.showFailMessage(event.body.message)
              }else{
                this.showFailMessage('Network error try again')
              }
              setTimeout(() => {
                this.progress = 0;
              }, 1500);
    
          }
        })
      }
  
      this.selectedFiles = undefined;
    }
  }


  saveDataWithImage(){ 
    this.fileWait=true
    let product=this.productForm.value;
    this.progress = 0;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        let formData=new FormData()
        formData.append('file', file);
        formData.append('name',product.name)
        formData.append('description',product.description)
        formData.append('sku',product.sku)
        formData.append('details',product.details)
        formData.append('offerprice',product.promoprice)
        if(this.showCategory){
          formData.append('category',product.category)
          formData.append('type','category')
        }else if(this.showDepartment){
          formData.append('department',product.department)
          formData.append('type','department')
        }else if(this.showSubCategory){
          formData.append('subcategory',product.subcategory)
          formData.append('type','subcategory')
        }
        formData.append('quantity',product.quantity)
        formData.append('price',product.price)
        this.productService.uploaDataWithImage(formData).pipe(
          catchError(err => of(this.showFailMessage(err)))).subscribe((event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              break;
            case HttpEventType.ResponseHeader:
              break;
            case HttpEventType.UploadProgress:
              if(event.total){
              const total: number = event.total; 
              this.progress = Math.round(event.loaded / total * 100);
              }
              break;
            case HttpEventType.Response:
              if(event.body.status=="success"){              
                this.showSuccessMessage("successfully saved data")
                this.productForm.reset()
                this.fileInfos = this.productService.getImages(event.body.id);
              }else if(event.body.status=="fail"){
                this.showFailMessage(event.body.message)
              }else{
                this.showFailMessage('Network error try again')
              }
              setTimeout(() => {
                this.progress = 0;
              }, 1500);
    
          }
        })
      }
      this.selectedFiles = undefined;
    }
  }

  deleteProductImage(file:any){
    if(file.imagetype=='main'){
   this.showFailMessage('cannot delete main photo,Set main photo first to delete');
    }else{
    this.IsWait=true
    this.productService.deleteImage(file.id).pipe(
     catchError(err => of(this.showFailMessage(err)))).subscribe(results => {
       this.IsWait=false
     this.response=results;
     if(this.response.status=='success'){
       this.showSuccessMessage("Successfully Deleted");
       this.fileInfos = this.productService.getImages(this.local_data.id);
     }else if(this.response.status=='fail'){
       this.showFailMessage(this.response.message);
     } else{
       this.showFailMessage("Fail to delete");
     }
   });
  }
  }

  openPhotoModal(image:{}) {
    const initialState = {
      image,
    };
    this.bsModalRef = this.modalService.show(DialogPhotoComponent, {class: 'modal-sm modal-dialog-centered',initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe((res: {image:any}) => {
      this.setPhotoType(res.image)
   });
  }

  setPhotoType(photo:any){
    let product=new ProductImage()
    product.id=photo.id
    product.imagetype=photo.category
    product.productid=this.local_data.id
    this.IsWait=true
    this.productService.setImageType(product).pipe(
     catchError(err => of([]))).subscribe(results => {
       this.IsWait=false
     this.response=results;
     if(this.response.status=='success'){
      this.fileInfos = this.productService.getImages(this.local_data.id);
       this.showSuccessMessage("Successfully Set As " + product.imagetype);
     }else if(this.response.status=='fail'){
       this.showFailMessage(this.response.message);
     } else{
       this.showFailMessage("Fail to Set");
     }
   });


  }

  onReady($event:any) {

    $event.plugins.get('FileRepository').createUploadAdapter = (loader:any) => {
 
      return new UploadAdapter(loader);
 
    };
 
  }


}


