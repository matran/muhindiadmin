import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvertComponent } from './components/advert/advert.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { CartComponent } from './components/cart/cart.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CustomersComponent } from './components/customers/customers.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DepartmentComponent } from './components/department/department.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductsComponent } from './components/products/products.component';
import { ShipLocationComponent } from './components/ship-location/ship-location.component';
import { SubcategoriesComponent } from './components/subcategories/subcategories.component';
import { GuardGuard } from './guards/guard.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent ,canActivate : [GuardGuard] ,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
      path: 'products',
      component: ProductsComponent
    },
    {
      path:'productdetails',
      component:ProductFormComponent
    },
    {
      path:'category',
      component: CategoriesComponent
    },
    {
      path:'subcategory',
      component: SubcategoriesComponent
    },
    {
      path:'department',
      component: DepartmentComponent
    },
    {
     path:'analytics',
     component:AnalyticsComponent
    },
    {
      path:'customers',
      component:CustomersComponent
     }
     ,
    {
      path:'orders',
      component:OrdersComponent
     },
     {
      path:'shipping',
      component:ShipLocationComponent
     }
     ,
     {
      path:'cart',
      component:CartComponent
     }
     ,
     {
      path:'ads',
      component:AdvertComponent
     }
    ]
  },
  {path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
