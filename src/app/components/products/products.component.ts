import { AfterViewInit, Component, OnDestroy, OnInit, Pipe, PipeTransform, TemplateRef, ViewChild } from '@angular/core';
import { Product } from 'src/app/models/product';
import { HttpClient, HttpResponse } from '@angular/common/http';
import 'node_modules/datatables.net-dt/css/jquery.dataTables.css'
import 'node_modules/jquery/dist/jquery.js'
import 'node_modules/datatables.net/js/jquery.dataTables.js'
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NgxIzitoastService } from 'ngx-izitoast';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';
import { DataTableDirective } from 'angular-datatables';
import { AppSettings } from 'src/app/models/app-settings';
class DataTablesResponse {
  data: any[]=[];
  draw: number=0;
  recordsFiltered: number=0;
  recordsTotal: number=0;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  products:any[]=[];
  dtOptions:DataTables.Settings={}
  response:any;
  bsModalRef!: BsModalRef;
  IsWait=false
  message:any={}
  uri=AppSettings.API_ENDPOINT
  constructor(public modalService: BsModalService,public iziToast: NgxIzitoastService,private http: HttpClient,private router : Router,private productService: ProductService) { }

  ngOnInit(): void {
   this.fetchData()
  }
  fetchData(){
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            `${this.uri}/allproduct`,
            dataTablesParameters, {}
          ).subscribe(
            resp => {
             that.products= resp.data;
              that.products = this.products.map(({
              0: id,
              1:sku,
              2:name,
              3:description,
              4:details,
              5:subcategory,
              6:category,
              7:department,
              8:price,
              9:offerprice,
              10:quantity,
              11:featured,
              12:image
              }) => ({
              id,
              sku,
              name,
              description,
              details,
              subcategory,
              category,
              department,
              price,
              offerprice,
              quantity,
              featured,
              image
              }));
           
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          }, error => this.showFailMessage(error.message));
         
      },
      columns: [{data:'image'},{ data: 'name' }, { data: 'description' },
      {data:'subcategory'},{data:'category'},{data:'department'},{data:'price'},{data:'offerprice'},{data:'quantity'},{data:'featured'}]
    };
  }


  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload()
    });
  }
  openProductDetails(action:any,products:any){
    this.router.navigate(['/productdetails'], {state: {data: products,action:action}});
  }

  deleteData(id:string){
    this.IsWait=true
    this.productService.deleteData(id).pipe(
     catchError(err => of([]))).subscribe(results => {
      this.rerender()
      this.response=results;
      this.IsWait=false
     if(this.response.status=='success'){
     
       this.showSuccessMessage("Successfully deleted");
     }else if(this.response.status=='fail'){
       this.showFailMessage(this.response.message);
     } else{
       this.showFailMessage("Fail to delete");
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

  openModal(product:{}) {
    const initialState = {
      product
    };
    this.bsModalRef = this.modalService.show(DialogConfirmComponent, {class: 'modal-sm modal-dialog-centered',initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe((res: { id: any; }) => {
      this.deleteData(res.id)
   });

  }

  setFeatured(data:any){
    let state=false
    if(data.featured == true){
      state=false
    }
    if(data.featured == false){
      state=true
    }
    this.IsWait=true;
    let product=new Product()
    product.id=data.id
    product.featured=state
    this.productService.setFeatured(product).pipe(
     catchError(err => of([]))).subscribe(results => {
     this.IsWait=false;
     this.response=results;
     if(this.response.status=='success'){
       this.rerender()
       if(state==true){
        this.showSuccessMessage("Successfully Set Featured");
       }else if(state == false){
        this.showSuccessMessage("Successfully UnSet Featured"); 
       }
     }else if(this.response.status=='fail'){
       this.showFailMessage(this.response.message);
     } else{
       this.showFailMessage("Fail to delete");
     }
   });
  
   }


  

 // 'https://angular-datatables-demo-server.herokuapp.com/',
}

