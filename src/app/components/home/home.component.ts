import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppSettings } from 'src/app/models/app-settings';
import { HomeService } from 'src/app/services/home.service';
import { RefreshTokenService } from 'src/app/services/refresh-token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  month:number=new Date().getMonth()+1
   monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
response:any;
currentmonth=""
processingcount=0
completedcount=0
totalorders=0
salescount=0
salesbalance=0
constructor( private router : Router,private homeService: HomeService) { }

  ngOnInit(): void {
    const d = new Date();
   this.currentmonth=this.monthNames[d.getMonth()];
   var month= new Date().getMonth()+1
   this.getData(month)
  }

  setValue(value:number):void {
    this.currentmonth=this.monthNames[value-1];
   this.getData(value)
  }

  getData(month:number){
    this.homeService.getOrderCount(month).pipe(
     catchError(err => of())).subscribe(results => {
      this.response=results
      if(this.response.status!='fail'){
      this.processingcount=this.response.processingcount
      this.completedcount=this.response.completedcount
      this.totalorders=this.processingcount  + this.completedcount
      this.salescount=this.response.salescount
      this.salesbalance=this.response.salesbalance
      }
   });
  }

}
