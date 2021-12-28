import 'node_modules/datatables.net-dt/css/jquery.dataTables.css'
import 'node_modules/jquery/dist/jquery.js'
import 'node_modules/datatables.net/js/jquery.dataTables.js'
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxIzitoastService } from 'ngx-izitoast';
import { AppSettings } from 'src/app/models/app-settings';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';
import { OrderService } from 'src/app/services/order.service';
import { catchError } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { of } from 'rxjs';
import { Order } from 'src/app/models/order';
import { DialogInvoiceComponent } from 'src/app/dialogs/dialog-invoice/dialog-invoice.component';
class DataTablesResponse {
  data: any[]=[];
  draw: number=0;
  recordsFiltered: number=0;
  recordsTotal: number=0;
}
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  orders:any[]=[];
  dtOptions:DataTables.Settings={}
  response:any;
  bsModalRef!: BsModalRef;
  IsWait=false
  uri=AppSettings.API_ENDPOINT
  constructor(private orderService:OrderService,public modalService: BsModalService,public iziToast: NgxIzitoastService,private http: HttpClient,private router : Router) { }
  ngOnInit(): void {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            `${this.uri}/orders`,
            dataTablesParameters, {}
          ).subscribe(resp => {
            that.orders= resp.data;
            console.log(resp)
              that.orders = this.orders.map(({
              0:id,
              1:orderid,
              2:customer,
              3:shipto,
              4:status,
              5:total,
              6:amount,
              7:totalquantity,
              8:shippingcost,
              9:phone,
              10:date,
              11:cart,
              12:paid
              }) => ({
              id,
              orderid,
              customer,
              shipto,
              status,
              total,
              amount,
              totalquantity,
              shippingcost,
              phone,
              date,
              cart,
              paid
              }));
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          }, error => this.showFailMessage(error.message));
      },
      columns: [{ data: 'id' },{ data: 'customer' },
      {data:'shipto'},{data:'amount'},{data:'date'},{data:'status'},{data:'paid'}]
    };
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
    this.orderService.deleteData(id).pipe(
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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload()
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

  viewCart(cart:any){
    sessionStorage.setItem("cart",cart.cart)
    sessionStorage.setItem("total",cart.total)
    sessionStorage.setItem("totalquantity",cart.totalquantity)
    this.router.navigate(['/cart']);
  }
  print(order:any){
    
  }
  openInvoice(order:{}) {
    const initialState = {
      order
    };
    this.bsModalRef = this.modalService.show(DialogInvoiceComponent, {class: 'modal-lg modal-dialog-centered',initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
   

  }

  changeStatus(status:string,id:any){ 
    this.IsWait=true;
    let order=new Order();
    order.id=id;
    order.status=status
    this.orderService.changeOrderStatus(order).pipe(
      catchError(err => of([]))
  ).subscribe(results => {
      this.IsWait=false;
      this.response=results;
       if(this.response.status=='success'){
        this.showSuccessMessage('Updated Successfully')
         this.rerender();
       }else if(this.response.status=='fail'){
        this.showFailMessage('Fail to update')
       }else{
        this.showFailMessage('Connection error')
       }
    });
    
  }


}
