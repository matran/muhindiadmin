import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxIzitoastService } from 'ngx-izitoast';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogDepartmentComponent } from 'src/app/dialogs/dialog-department/dialog-department.component';
import { AppSettings } from 'src/app/models/app-settings';
import { Department } from 'src/app/models/department';
import { DepartmentService } from 'src/app/services/department.service';
class DataTablesResponse {
  data: any[]=[];
  draw: number=0;
  recordsFiltered: number=0;
  recordsTotal: number=0;
}
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective
  departments:any[]=[]
  dtOptions:DataTables.Settings={}
  bsModalRef!: BsModalRef
  response:any
  IsWait=false
  uri=AppSettings.API_ENDPOINT
  constructor(private departmentService:DepartmentService,public modalService: BsModalService,public iziToast: NgxIzitoastService,private http: HttpClient,private router : Router) { }

  ngOnInit(): void {
   this.fetchData()
  }
  fetchData():void {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            `${this.uri}/datatabledepartment`,
            dataTablesParameters, {}
          ).subscribe(resp => {
            that.departments= resp.data;
              that.departments = that.departments.map(({
              0: id,
              1:name
              }) => ({
              id,
              name
              }));
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          }, error => this.showFailMessage(error.message));
      },
      columns: [{ data: 'id' }, { data: 'name' }]
    };
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload()
    });
  }

  openDepartmentModal(action:string,department:{}) {
    const initialState = {
      department,
      action: action
    };
    this.bsModalRef = this.modalService.show(DialogDepartmentComponent, {class: 'modal-sm modal-dialog-centered',initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe((res: {department:any}) => {
      if(action=="Update"){
    this.updateData(res.department)
      }else if(action=="Add"){
      this.saveData(res.department)
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
    this.departmentService.deleteData(id).pipe(
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
    let department=new Department()
    department.id=data.id
    department.name=data.name
    this.departmentService.updateData(department).pipe(
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
    let department=new Department()
    department.name=data.name
    this.departmentService.saveData(department).pipe(
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
