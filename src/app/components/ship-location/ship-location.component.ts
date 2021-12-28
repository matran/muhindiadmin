import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxIzitoastService } from 'ngx-izitoast';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogLocationComponent } from 'src/app/dialogs/dialog-location/dialog-location.component';
import { AppSettings } from 'src/app/models/app-settings';
import { ShipLocation } from 'src/app/models/ship-location';
import { ShipLocationService } from 'src/app/services/ship-location.service';
class DataTablesResponse {
  data: any[]=[];
  draw: number=0;
  recordsFiltered: number=0;
  recordsTotal: number=0;
}
@Component({
  selector: 'app-ship-location',
  templateUrl: './ship-location.component.html',
  styleUrls: ['./ship-location.component.css']
})
export class ShipLocationComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions:DataTables.Settings={}
  locations:any[]=[];
  bsModalRef!: BsModalRef;
  response:any;
  IsWait=false
  uri=AppSettings.API_ENDPOINT
  constructor(private locationService:ShipLocationService,public modalService: BsModalService,public iziToast: NgxIzitoastService,private http: HttpClient,private router : Router) { }

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
            `${this.uri}/datatablelocation`,
            dataTablesParameters, {}
          ).subscribe(resp => {
            that.locations= resp.data;
            console.log(resp.data)
              that.locations = that.locations.map(({
              0: id,
              1:location,
              2:price
              }) => ({
              id,
              location,
              price
              }));
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          }, error => this.showFailMessage(error.message));
      },
      columns: [{ data: 'id' }, { data: 'location' },{data:'price'}]
    };
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload()
    });
  }
  openLocationModal(action:string,location:{}) {
    const initialState = {
      location,
      action: action
    };
    this.bsModalRef = this.modalService.show(DialogLocationComponent, {class: 'modal-sm modal-dialog-centered',initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe((res: {location:any}) => {
      if(action=="Update"){
    this.updateData(res.location)
      }else if(action=="Add"){
      this.saveData(res.location)
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
    this.locationService.deleteData(id).pipe(
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
    let location=new ShipLocation()
    location.id=data.id
    location.location=data.location
    location.price=data.price
    this.locationService.updateData(location).pipe(
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
    let location=new ShipLocation()
    location.id=data.id
    location.location=data.location
    location.price=data.price
    this.locationService.saveData(location).pipe(
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
