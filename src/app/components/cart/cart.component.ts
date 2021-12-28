import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  data:any[]=[];
  total:any=0
  totalquantity:any=0
  constructor() { }

  ngOnInit(): void {
    this.data=JSON.parse(sessionStorage.getItem("cart") || "[]");
    this.total=sessionStorage.getItem("total")
    this.totalquantity=sessionStorage.getItem("totalquantity")
  }

}
