import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxIzitoastService } from 'ngx-izitoast';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogAdvertComponent } from 'src/app/dialogs/dialog-advert/dialog-advert.component';
import { DialogCategoryComponent } from 'src/app/dialogs/dialog-category/dialog-category.component';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';
import { Advert } from 'src/app/models/advert';
import { AppSettings } from 'src/app/models/app-settings';
import { Category } from 'src/app/models/category';
import { AdvertService } from 'src/app/services/advert.service';
class DataTablesResponse {
  data: any[]=[];
  draw: number=0;
  recordsFiltered: number=0;
  recordsTotal: number=0;
}
@Component({
  selector: 'app-advert',
  templateUrl: './advert.component.html',
  styleUrls: ['./advert.component.css']
})
export class AdvertComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  adverts:any[]=[];
  dtOptions:DataTables.Settings={}
  bsModalRef!: BsModalRef;
  response:any;
  IsWait=false
  uri=AppSettings.API_ENDPOINT
  constructor(private advertService:AdvertService,public modalService: BsModalService,public iziToast: NgxIzitoastService,private http: HttpClient,private router : Router) { }

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
            `${this.uri}/datatableadvert`,
            dataTablesParameters, {}
          ).subscribe(resp => {
            that.adverts= resp.data;
              that.adverts = that.adverts.map(({
              0: id,
              1:section,
              2:image,
              3:title,
              4:notes,
              5:link,
              6:date
              }) => ({
              id,
              section,
              image,
              title,
              notes,
              link,
              date
              }));
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          },error => this.showFailMessage(error.message));
      },
      columns: [{ data: 'id' }, { data: 'image' },{data:'title'},{data:'link'}]
    };
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload()
    });
  }
  openAdvertModal(action:string,advert:{}) {
    const initialState = {
      advert,
      action: action
    };
    this.bsModalRef = this.modalService.show(DialogAdvertComponent, {class: 'modal-lg modal-dialog-centered',initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe((res: {advert:any}) => {
      console.log(res.advert)
      
      if(action=="Update"){
    this.updateData(res.advert)
      }else if(action=="Add"){
      this.saveData(res.advert)
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
    this.advertService.deleteData(id).pipe(
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
    let advert=new FormData()
    if(data.image==null){
      advert.append('photostatus', 'unavailable')
    }else{
      advert.append('photostatus', 'available')
      advert.append('file', data.image)
    }
    advert.append('id', data.id)
    advert.append('notes', data.notes)
    advert.append('title', data.title)
    advert.append('link', data.link)
    advert.append('section',data.section)
    this.advertService.updateData(advert).pipe(
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
    let advert=new FormData()
    advert.append('section',data.section)
    advert.append('file', data.image)
    advert.append('notes', data.notes)
    advert.append('title', data.title)
    advert.append('link', data.link)
    this.advertService.saveData(advert).pipe(
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
