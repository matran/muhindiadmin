import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxIzitoastService } from 'ngx-izitoast';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogCategoryComponent } from 'src/app/dialogs/dialog-category/dialog-category.component';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';
import { AppSettings } from 'src/app/models/app-settings';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
class DataTablesResponse {
  data: any[]=[];
  draw: number=0;
  recordsFiltered: number=0;
  recordsTotal: number=0;
}
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  categories:any[]=[];
  dtOptions:DataTables.Settings={}
  bsModalRef!: BsModalRef;
  response:any;
  IsWait=false
  uri=AppSettings.API_ENDPOINT
  constructor(private categoryService:CategoryService,public modalService: BsModalService,public iziToast: NgxIzitoastService,private http: HttpClient,private router : Router) { }

  ngOnInit(): void {
    this.fetchData()
  }

  fetchData():void{
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            `${this.uri}/datatablecategory`,
            dataTablesParameters, {}
          ).subscribe(resp => {
            that.categories= resp.data;
              that.categories = that.categories.map(({
              0: id,
              1:name,
              2:parent
              }) => ({
              id,
              name,
              parent
              }));
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          }, error => this.showFailMessage(error.message));
      },
      columns: [{ data: 'id' }, { data: 'name' },{data:'parent'}]
    };
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload()
    });
  }
  openCategoryModal(action:string,category:{}) {
    const initialState = {
      category,
      action: action
    };
    this.bsModalRef = this.modalService.show(DialogCategoryComponent, {class: 'modal-sm modal-dialog-centered',initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe((res: {category:any}) => {
      console.log(res.category)
      if(action=="Update"){
    this.updateData(res.category)
      }else if(action=="Add"){
      this.saveData(res.category)
      }
   });

  }
  openDeleteModal(product:{}) {
    const initialState = {
      product
    };
    this.bsModalRef = this.modalService.show(DialogConfirmComponent, {class: 'modal-sm modal-dialog-centered',initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe((res: { id: any; }) => {
     this.deleteData(res.id)
   });

  }
  deleteData(id:string){
    this.IsWait=true
    this.categoryService.deleteData(id).pipe(
     catchError(err => of([]))).subscribe(results => {
      this.response=results;
      this.IsWait=false
     if(this.response.status=='success'){
       this.showSuccessMessage("Successfully deleted");
       this.rerender()
     }else if(this.response.status=='fail'){
       this.showFailMessage(this.response.message);
     } else{
       this.showFailMessage("Fail to delete");
     }
   });

  }

  updateData(data:any){
    this.IsWait=true
    let category=new Category()
    category.id=data.id
    category.name=data.name
    category.parent=data.department
    this.categoryService.updateData(category).pipe(
      catchError(err => of([]))).subscribe(results => {
      this.response=results;
      this.IsWait=false
      if(this.response.status=='success'){
        this.showSuccessMessage("Updated successfully")
        this.rerender()
      }else{
        this.showFailMessage("Unable to Save. Internet connection error")
      }
    })
  }

  saveData(data:any){
    this.IsWait=true
    let department=new Category()
    department.name=data.name
    department.parent=data.department
    this.categoryService.saveData(department).pipe(
      catchError(err => of([]))).subscribe(results => {
      this.response=results
      this.IsWait=false
      if(this.response.status=='success'){
         this.showSuccessMessage("Saved successfully")
         this.rerender()
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

}
